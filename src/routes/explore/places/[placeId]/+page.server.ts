import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

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

    const unusedWorkplaceReviewTokens = user?.workplaceReviewTokens.filter(({workplaceReview}) => workplaceReview === null)

    return { place, userVerified, reviewToken: unusedWorkplaceReviewTokens.at(0)?.token };
}) satisfies PageServerLoad;


const postReviewFormDataSchema = z.object({
    general: z.string(),
    rating: z.coerce.number().min(0).max(100),
    compensation: z.coerce.number().min(0).max(100),
    workplaceReviewToken: z.string().min(1).refine(async (t) => {
        const availableToken = await prisma.workplaceReviewToken.findUnique({where: {token: t}, include: {workplaceReview: true}})
    
        return !!availableToken && availableToken.workplaceReview === null
    }, 'not a valid workplace review token')
})

export const actions: Actions = {
    postReview: async ({ request, locals, params }) => {
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

        const parsedData = await postReviewFormDataSchema.safeParseAsync(formData)

        if (!parsedData.success) {
            throw error(400, { message: parsedData.error.issues[0].message })
        }

        await prisma.workplaceReview.create({
            data: {
                createdByUser: {
                    connect: { email }
                },
                place: { connect: { id: params.placeId } },
                description: parsedData.data.general,
                overallRating: parsedData.data.rating,
                workplaceReviewToken: {connect: {token: parsedData.data.workplaceReviewToken}}
            }
        }).catch((console.warn))

        return { postReviewSuccess: true }
    }
}