import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { findUserByRequestEvent } from '$lib/server/utils/user';
import { createIndustryVerificationToken } from '$lib/server/utils/verification-token';

export const load = (async ({ locals }) => {

    const sessionUser = (await locals.getSession())?.user

    if (!sessionUser) {
        throw redirect(302, '/auth/nope')
    }

    const user = await prisma.user.findUnique({
        where: { email: sessionUser.email! },
        include: { createdIndustryTokens: { include: { consumedByUser: { select: { id: true } } } } }
    })

    if (!user?.industryVerificationToken) {
        throw error(403, { message: 'not verified, cannot access' })
    }

    const createdTokens = user.createdIndustryTokens.map((token) => {
        const { consumedByUser, ...rest } = token

        return { consumed: consumedByUser !== null, ...rest }
    })


    return { createdTokens };
}) satisfies PageServerLoad;

export const actions = {
    createToken: async (event) => {
        const user = await findUserByRequestEvent(event)

        if (!user) {
            throw error(403, { message: 'user not logged in' })
        }

        if (!user?.industryVerificationToken) {
            throw error(403, 'user must be verified to create a new verification token')
        }

        const newToken = await createIndustryVerificationToken(user.id)

        return { newToken: { ...newToken, consumed: false } }
    }
} satisfies Actions