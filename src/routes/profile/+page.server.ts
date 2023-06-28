import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { findUserByRequestEvent } from '$lib/server/crud/user';

export const load = (async (event) => {
	const session = await event.locals.getSession();

	if (!session?.user) throw redirect(303, '/auth/nope');

	const user = await prisma.user.findUnique({
		where: { email: session.user.email! },
		include: { verification: true, workplaceReviewTokens: { include: { workplaceReview: true } } }
	})

	if (!user) throw redirect(303, '/auth/nope')

	return { user };
}) satisfies PageServerLoad;

export const actions = {
	addWorkplaceReviewToken: async (event) => {
		const user = await findUserByRequestEvent(event)

		if (!user) {
			throw error(404, { message: 'user not found' })
		}

		const res = await prisma.workplaceReviewToken.create({
			data: {
				associatedUser: { connect: { id: user.id } }
			}
		})

		return { createdWorkplaceReviewToken: res.token }
	}
} satisfies Actions