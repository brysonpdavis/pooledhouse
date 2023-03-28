import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({params, locals}) => {

    const place = await prisma.place.findUnique({where: {id: params.placeId}, include: {reviews: true}})

    if (!place) {
        throw error(404, "couldn't find a place with that id")
    }

    const userEmail = (await locals.getSession())?.user?.email

    if (!userEmail) {
        return {place, userVerified: false}
    }

    const user = await prisma.user.findUnique({where: {email: userEmail}})

    console.log('industry verification token: ', user?.industryVerificationToken)

    return {place, userVerified: !!user?.industryVerificationToken};
}) satisfies PageServerLoad;