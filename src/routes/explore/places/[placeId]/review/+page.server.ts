import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {

    const place = await prisma.place.findUnique({ where: { id: params.placeId } })

    if (!place) {
        throw error(404, "couldn't find a place with that id")
    }

    const userEmail = (await locals.getSession())?.user?.email

    if (!userEmail) {
        throw redirect(303, '/auth/nope')
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } })

    return { place, userVerified: !!user?.industryVerificationToken };
}) satisfies PageServerLoad;

const postReviewFormDataSchema = z.object({
    general: z.string(),
    rating: z.coerce.number().min(0).max(100),
    compensation: z.coerce.number().min(0).max(100)
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

        console.log(formData)

        const parsedData = postReviewFormDataSchema.safeParse(formData)

        if (!parsedData.success) {
            throw error(400, {message: 'malformatted data'})
        }

        await prisma.review.create({
            data: {
                createdByUser: {
                    connect: { email }
                },
                place: {connect: {id: params.placeId}},
                description: parsedData.data.general,
                overallRating: parsedData.data.rating
            }
        }).catch((console.warn))

        return {postReviewSuccess: true}
    }
}