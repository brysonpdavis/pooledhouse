import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { error, fail } from '@sveltejs/kit';
import { postWorkplaceReviewFormDataSchema } from './post-workplace-review-form-zod-schema';

export const load = (async ({ locals, params }) => {
    const userEmail = (await locals.getSession())?.user?.email

    if (!userEmail) {
        return { userVerified: false }
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail }, include: { workplaceReviewTokens: { include: { workplaceReview: { select: { id: true } } } } } })

    if (!user) {
        throw error(404, "unexpected error")
    }

    const previousWorkplaceReview = await prisma.workplaceReview.findFirst({ where: { createdByUserId: user.id, placeId: params.placeId } })

    const previousExperienceReview = await prisma.experienceReview.findFirst({ where: { createdByUserId: user.id, placeId: params.placeId } })

    const unusedWorkplaceReviewTokens = user?.workplaceReviewTokens.filter(({ workplaceReview }) => workplaceReview === null)

    return { previousWorkplaceReview, previousExperienceReview, userVerified: user.industryVerificationToken !== null, reviewToken: unusedWorkplaceReviewTokens.at(0)?.token };
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