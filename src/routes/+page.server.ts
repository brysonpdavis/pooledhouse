import { prisma } from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({locals}) => {
    const sessionUserEmail = (await locals.auth.validate())?.user?.userId

    if (!sessionUserEmail) {
        redirect(303, '/home');
    }

    const user = await prisma.user.findUnique({where: {email: sessionUserEmail}})

    // if user is logged in and verified, take them to the explore page
    if (user && user.industryVerificationToken !== null) {
        redirect(303, '/explore');
    }

    redirect(303, '/home');

    return {}
}) satisfies PageServerLoad