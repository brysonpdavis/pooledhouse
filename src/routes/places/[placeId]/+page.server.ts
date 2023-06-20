import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
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
            }
        }
    })

    const userVerified = !!user?.industryVerificationToken


    return { comments, usersCommentReactions, place, userVerified };
}) satisfies PageServerLoad;


export const actions: Actions = {
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

        return
    }
}

function notNull<T>(x: T | undefined | null): x is T {
    return x !== undefined && x !== null
}

function commentsComparator(comment1: ReviewComment, comment2: ReviewComment): number {
    return comment2.reactionScore - comment1.reactionScore
}

function calculateReactionScore({ reactions, agreements }: { reactions: number, agreements: number }): number {
    return ((2 * agreements) - reactions) / reactions
}