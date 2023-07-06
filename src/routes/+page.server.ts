import { prisma } from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({locals}) => {
    const sessionUserEmail = (await locals.getSession())?.user?.email

    if (!sessionUserEmail) {
        throw redirect(303, '/home')
    }

    const user = await prisma.user.findUnique({where: {email: sessionUserEmail}})

    // if user is logged in and verified, take them to the explore page
    if (user && user.industryVerificationToken !== null) {
        throw redirect(303, '/explore')
    }

    throw redirect(303, '/home')

    return {}
}) satisfies PageServerLoad