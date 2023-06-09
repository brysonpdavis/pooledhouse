import { prisma } from '$lib/server/prisma';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { postWorkplaceReviewFormDataSchema } from './post-workplace-review-form-zod-schema';
import type { ReviewComment } from '@prisma/client';

export const load = (async ({ params, locals }) => {

    const placeResult = await prisma.place.findUnique({
        where: { id: params.placeId },
        include: {
            workplaceReviews: {
                include:
                {
                    overallDescriptionComment: true,
                    compensationDescriptionComment: true,
                    guestDescriptionComment: true,
                    idealForComment: true,
                    cultureDescriptionComment: true
                }
            },
            experienceReviews: {
                include: {
                    fnbDescriptionComment: true,
                    vibeDescriptionComment: true,
                    overallDescriptionComment: true
                }
            }
        }
    })

    if (!placeResult) {
        throw error(404, 'place not found')
    }

    const { workplaceReviews, experienceReviews, ...place } = placeResult

    const comments = {
        workplace: {
            general: workplaceReviews.map(wr => wr.overallDescriptionComment).filter(notNull).sort(commentsComparator),
            compensation: workplaceReviews.map(wr => wr.compensationDescriptionComment).filter(notNull).sort(commentsComparator),
            guest: workplaceReviews.map(wr => wr.guestDescriptionComment).filter(notNull).sort(commentsComparator),
            culture: workplaceReviews.map(wr => wr.cultureDescriptionComment).filter(notNull).sort(commentsComparator)
        },
        experience: {
            general: experienceReviews.map(er => er.overallDescriptionComment).filter(notNull).sort(commentsComparator),
            fnb: experienceReviews.map(er => er.fnbDescriptionComment).filter(notNull).sort(commentsComparator),
            vibe: experienceReviews.map(er => er.vibeDescriptionComment).filter(notNull).sort(commentsComparator)
        }
    }

    if (!place) {
        throw error(404, "couldn't find a place with that id")
    }

    const userEmail = (await locals.getSession())?.user?.email

    if (!userEmail) {
        return { comments, place, userVerified: false }
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail }, include: { workplaceReviewTokens: { include: { workplaceReview: { select: { id: true } } } } } })

    if (!user) {
        throw error(404, "unexpected error")
    }

    const usersCommentReactions = await prisma.reviewCommentReaction.findMany({
        where: {
            userId: user.id,
            reviewComment: {
                review: { OR: [{ workplaceReview: { placeId: place.id } }, { experienceReview: { placeId: place.id } }] }
                // reviewId: {
                //     in: [
                //         ...placeResult.workplaceReviews.map(wr => wr.id),
                //         ...placeResult.experienceReviews.map(er => er.id)
                //     ]
                // }
            }
        }
    })

    const userVerified = !!user?.industryVerificationToken

    const unusedWorkplaceReviewTokens = user?.workplaceReviewTokens.filter(({ workplaceReview }) => workplaceReview === null)

    const previousWorkplaceReview = await prisma.workplaceReview.findFirst({ where: { createdByUserId: user.id, placeId: place.id } })

    const previousExperienceReview = await prisma.experienceReview.findFirst({ where: { createdByUserId: user.id, placeId: place.id } })

    return { comments, usersCommentReactions, place, userVerified, reviewToken: unusedWorkplaceReviewTokens.at(0)?.token, previousWorkplaceReview, previousExperienceReview };
}) satisfies PageServerLoad;


export const actions: Actions = {
    postWorkplaceReview: async ({ request, locals, params, fetch }) => {
        const session = await locals.getSession()

        const email = session?.user?.email

        if (email === null) {
            return { reviewFailed: true, failureReason: 'user not logged in' }
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.industryVerificationToken) {
            return { reviewFailed: true, failureReason: 'user not verified' }
        }

        const formData = Object.fromEntries(await request.formData())

        const parsedData = await postWorkplaceReviewFormDataSchema.safeParseAsync(formData)

        if (!parsedData.success) {
            return fail(400, { workplaceReviewSchemaErrors: parsedData.error.format() })
        }

        const { id } = await prisma.review.create({ data: { createdByUser: { connect: { email } } } })

        console.log('review id: ', id)

        const result = await prisma.workplaceReview.create({
            data: {
                review: { connect: { id } },
                createdByUser: {
                    connect: { email }
                },
                place: { connect: { id: params.placeId } },
                overallDescriptionComment: { create: { text: parsedData.data.general, review: { connect: { id } } } },
                overallRating: parsedData.data.rating,
                compensationRating: parsedData.data.compensation,
                compensationDescriptionComment: parsedData.data.compensationDescription ? { create: { text: parsedData.data.compensationDescription!, review: { connect: { id } } } } : undefined,
                guestDescriptionComment: parsedData.data.guestDescription ? { create: { text: parsedData.data.guestDescription, review: { connect: { id } } } } : undefined,
                cultureDescriptionComment: parsedData.data.cultureDescription ? { create: { text: parsedData.data.cultureDescription, review: { connect: { id } } } } : undefined,
                idealForComment: parsedData.data.idealFor ? { create: { text: parsedData.data.idealFor, review: { connect: { id } } } } : undefined,
                workplaceReviewToken: { connect: { token: parsedData.data.workplaceReviewToken } },
            }
        })

        console.log(JSON.stringify(result, undefined, 2))

        await refreshPlaceScores(params.placeId, fetch).catch(console.warn)

        return { postWorkplaceReviewSuccess: true }
    },
    postExperienceReview: async ({ request, params, fetch }) => {
        console.log('posting experience review..........', await request.formData())

        // TODO: implement this action...

        await refreshPlaceScores(params.placeId, fetch)

        return { postExperienceReviewSuccess: true }
    },
    deleteReview: async ({ request }) => {

        const reviewId = (await request.formData()).get('reviewId')?.valueOf()

        if (!reviewId || typeof reviewId !== "string") {
            return { deleteFailed: true }
        }

        const res = await prisma.workplaceReview.delete({ where: { id: reviewId } })

        console.log('deleted: ', res)
    },
    commentReaction: async ({ request, locals }) => {
        const formData = await request.formData()
        const commentId = formData.get('commentId')?.valueOf()
        const agree = formData.get('agree')?.valueOf()

        const reactionBool = agree === "agree" || (agree === "disagree" ? false : null)

        if (commentId === undefined || reactionBool === null) {
            throw error(404, "required info not provied")
        }

        const userEmail = (await locals.getSession())?.user?.email

        if (!userEmail) {
            throw error(404, 'user not logged in')
        }

        const userId = (await prisma.user.findUnique({ where: { email: userEmail } }))?.id

        if (!userId) {
            throw error(404, 'user not found')
        }

        const reactions = await prisma.reviewCommentReaction.findMany({ where: { reviewCommentId: commentId } })

        const existingReaction = reactions.find(r => r.userId === userId)

        if (existingReaction) {
            if (existingReaction.agree === reactionBool) {
                return
            }

            await prisma.$transaction([
                prisma.reviewComment.update({
                    where: { id: commentId as string },
                    data: {
                        numberOfAgreements: { increment: reactionBool ? 1 : -1 },
                        reactionScore: calculateReactionScore({
                            reactions: reactions.length,
                            agreements: reactions.filter(r => r.agree).length + (reactionBool ? 1 : -1)
                        })
                    }
                }),
                prisma.reviewCommentReaction.update({
                    where: { id: existingReaction.id },
                    data: { agree: reactionBool }
                })
            ])

            return
        }

        await prisma.reviewComment.update({
            where: { id: commentId as string },
            data: {
                numberOfAgreements: { increment: reactionBool ? 1 : 0 },
                numberOfReactions: { increment: 1 },
                reactionScore: reactionBool ? 1 : -1,
                reactions: { create: { agree: reactionBool, user: { connect: { id: userId } } } }
            }
        })
    }
}

async function refreshPlaceScores(placeId: string, fetchMethod: typeof fetch) {
    await fetchMethod(`/api/places/${placeId}/refresh`, { method: 'POST' })
}

function notNull<T>(x: T | undefined | null): x is T {
    return x !== undefined && x !== null
}

function commentsComparator(comment1: ReviewComment, comment2: ReviewComment): number {
    return comment1.reactionScore - comment2.reactionScore
}

function calculateReactionScore({ reactions, agreements }: { reactions: number, agreements: number }): number {
    return ((2 * agreements) - reactions) / reactions
}