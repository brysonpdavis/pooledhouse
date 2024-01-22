import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { findUserByRequestEvent } from '$lib/server/crud/user';
import { createIndustryVerificationToken } from '$lib/server/crud/verification-token';

export const load = (async ({ locals }) => {

    const sessionUser = (await locals.auth.validate())?.user

    if (!sessionUser) {
        redirect(302, '/auth/nope');
    }

    const user = await prisma.user.findUnique({
        where: { email: sessionUser.email! },
        include: { createdIndustryTokens: { include: { consumedByUser: { select: { id: true } } } } }
    })

    if (!user) {
        error(403, { message: 'could not look up user?' });
    }

    const createdTokens = user.createdIndustryTokens.map((token) => {
        const { consumedByUser, ...rest } = token

        return { consumed: consumedByUser !== null, ...rest }
    })


    return { createdTokens, userVerified: !!user.industryVerificationToken };
}) satisfies PageServerLoad;

export const actions = {
    createToken: async (event) => {
        const user = await findUserByRequestEvent(event)

        if (!user) {
            error(403, { message: 'user not logged in' });
        }

        if (!user?.industryVerificationToken) {
            error(403, 'user must be verified to create a new verification token');
        }

        const newToken = await createIndustryVerificationToken(user.id)

        return { newToken: { ...newToken, consumed: false } }
    },
    verifyMe: async (event) => {
        console.log('starting verification')
        const user = await findUserByRequestEvent(event)

        if (!user) {
            error(403, { message: 'user not logged in' });
        }

        const providedToken = (await event.request.formData()).get('verificationToken')

        if (!providedToken) {
            return { invalidToken: true }
        }

        const availableToken = await matchAvailableIndustryVerificationToken(providedToken.toString())

        if (!availableToken) {
            return { unavailableToken: true }
        }

        const updatedUser = await updateUserWithVerificationToken(user.id, availableToken.token)

        await createWorkplaceReviewTokenFromUserId(availableToken.createdByUserId)

        return {
            verificationSuccess: updatedUser.industryVerificationToken === availableToken.token
        }
    }
} satisfies Actions

async function updateUserWithVerificationToken(userId: string, token: string) {
    return await prisma.user.update({
        where: { id: userId },
        data: { industryVerificationToken: { set: token } },
        select: { industryVerificationToken: true }
    })
}

async function createWorkplaceReviewTokenFromUserId(userId: string) {
    return await prisma.workplaceReviewToken.create({
        data: { associatedUser: { connect: { id: userId } } }
    })
}

async function matchAvailableIndustryVerificationToken(token: string) {
    return await prisma.industryVerificationToken.findFirst({
        where: { token: token.toUpperCase(), consumedByUser: null }
    })
}