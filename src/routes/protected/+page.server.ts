import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async (event) => {
	const session = await event.locals.getSession();

	if (!session?.user) throw redirect(303, '/auth/nope');

	const user = await prisma.user.findUnique({
		where: { email: session.user.email! },
		include: { verification: true, workplaceReviewTokens: { include: { workplaceReview: true } } }
	})

	if (!user) throw redirect(303, '/auth/nope')

	return {user};
}) satisfies PageServerLoad;
