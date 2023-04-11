import { prisma } from '$lib/server/prisma';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { postWorkplaceReviewFormDataSchema } from './post-workplace-review-form-zod-schema';

export const load = (async ({ params, locals }) => {

    const place = await prisma.place.findUnique({
        where: { id: params.placeId },
        include: { workplaceReviews: true, experienceReviews: true }
    })

    if (!place) {
        throw error(404, "couldn't find a place with that id")
    }

    const userEmail = (await locals.getSession())?.user?.email

    if (!userEmail) {
        return { place, userVerified: false }
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail }, include: { workplaceReviewTokens: { include: { workplaceReview: { select: { id: true } } } } } })

    if (!user) {
        return { place }
    }

    const userVerified = !!user?.industryVerificationToken

    const unusedWorkplaceReviewTokens = user?.workplaceReviewTokens.filter(({ workplaceReview }) => workplaceReview === null)

    const previousWorkplaceReview = await prisma.workplaceReview.findFirst({ where: { createdByUserId: user.id, placeId: place.id } })

    const previousExperienceReview = await prisma.experienceReview.findFirst({ where: { createdByUserId: user.id, placeId: place.id } })

    return { place, userVerified, reviewToken: unusedWorkplaceReviewTokens.at(0)?.token, previousWorkplaceReview, previousExperienceReview };
}) satisfies PageServerLoad;


export const actions: Actions = {
    postWorkplaceReview: async ({ request, locals, params }) => {
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
            return fail(400, {workplaceReviewSchemaErrors: parsedData.error.format()})
        }

        const result = await prisma.workplaceReview.create({
            data: {
                createdByUser: {
                    connect: { email }
                },
                place: { connect: { id: params.placeId } },
                description: parsedData.data.general,
                overallRating: parsedData.data.rating,
                compensationRating: parsedData.data.compensation,
                compensationDescription: parsedData.data.compensationDescription || undefined,
                guestDescription: parsedData.data.guestDescription || undefined,
                cultureDescription: parsedData.data.cultureDescription || undefined,
                idealFor: parsedData.data.idealFor || undefined,
                workplaceReviewToken: { connect: { token: parsedData.data.workplaceReviewToken } }
            }
        }).catch(console.warn)

        console.log(JSON.stringify(result, undefined, 2))

        return { postWorkplaceReviewSuccess: true }
    },
    postExperienceReview: async ({request}) => {
        console.log('posting experience review..........', await request.formData())

        // TODO: implement this action...

        return {postExperienceReviewSuccess: true}
    },
    deleteReview: async ({request}) => {

        const reviewId = (await request.formData()).get('reviewId')?.valueOf()

        if (!reviewId || typeof reviewId !== "string") {
            return {deleteFailed: true}
        }

        const res = await prisma.workplaceReview.delete({where: {id: reviewId}})

        console.log('deleted: ', res)
    }
}