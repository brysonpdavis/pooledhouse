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

    const {workplaceReviews, experienceReviews, ...place} = placeResult

    const comments = {
        // workplace comments
        workplaceOverallComments: workplaceReviews.map(wr => wr.overallDescriptionComment).filter(notNull).sort(commentsComparator),
        compensationComments: workplaceReviews.map(wr => wr.compensationDescriptionComment).filter(notNull).sort(commentsComparator),
        guestComments: workplaceReviews.map(wr => wr.guestDescriptionComment).filter(notNull).sort(commentsComparator),
        cultureComments: workplaceReviews.map(wr => wr.cultureDescriptionComment).filter(notNull).sort(commentsComparator),
        // experience comments
        experienceOverallComments: experienceReviews.map(er => er.overallDescriptionComment).filter(notNull).sort(commentsComparator),
        fnbComments: experienceReviews.map(er => er.fnbDescriptionComment).filter(notNull).sort(commentsComparator),
        vibeComments: experienceReviews.map(er => er.vibeDescriptionComment).filter(notNull).sort(commentsComparator)
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
        return { comments, place }
    }

    const userVerified = !!user?.industryVerificationToken

    const unusedWorkplaceReviewTokens = user?.workplaceReviewTokens.filter(({ workplaceReview }) => workplaceReview === null)

    const previousWorkplaceReview = await prisma.workplaceReview.findFirst({ where: { createdByUserId: user.id, placeId: place.id } })

    const previousExperienceReview = await prisma.experienceReview.findFirst({ where: { createdByUserId: user.id, placeId: place.id } })

    return { comments, place, userVerified, reviewToken: unusedWorkplaceReviewTokens.at(0)?.token, previousWorkplaceReview, previousExperienceReview };
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
    }
}

async function refreshPlaceScores(placeId: string, fetchMethod: typeof fetch) {
    await fetchMethod(`/api/places/${placeId}/refresh`, { method: 'POST' })
}

function notNull<T>(x: T | undefined | null): x is T  {
    return x !== undefined && x !== null
}

function commentsComparator(comment1: ReviewComment, comment2: ReviewComment): number {
    return comment1.reactionScore - comment2.reactionScore
}