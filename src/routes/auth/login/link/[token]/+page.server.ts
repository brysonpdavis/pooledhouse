import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({params, locals}) => {
    const {token} = params

    const validToken = await prisma.loginToken.findUnique({where: {token}})

    if (!validToken) {
        return {
            status: 404,
            error: {
                message: 'invalid token'
            }
        }
    }

    if (validToken.expires < new Date()) {
        return {
            status: 410,
            error: {
                message: 'token expired'
            }
        }
    }

    const sesh = await auth.createSession({userId: validToken.userId, attributes: {}})

    locals.auth.setSession(sesh)

    redirect(302, '/profile');
}) satisfies PageServerLoad;