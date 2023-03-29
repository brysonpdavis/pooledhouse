import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    const sessionUser = (await locals.getSession())?.user

    if (!sessionUser) {
        throw redirect(302, '/auth/nope')
    }

    const user = await prisma.user.findUnique({where: {email: sessionUser.email!}})

    if (!user?.industryVerificationToken) {
        throw error(403, {message: 'not verified, cannot access'})
    }


    return {};
}) satisfies PageServerLoad;