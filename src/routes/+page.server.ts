import { prisma } from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({locals}) => {
    const sessionUserEmail = (await locals.getSession())?.user?.email

    if (!sessionUserEmail) {
        return {}
    }

    const user = await prisma.user.findUnique({where: {email: sessionUserEmail}})

    if (!user) {
        return {}
    }

    // if user is logged in and verified, take them to the explore page
    if (user.industryVerificationToken !== null) {
        throw redirect(302, '/explore')
    }

    return {}
}) satisfies PageServerLoad