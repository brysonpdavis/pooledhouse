import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';

export const load = (async (event) => {
	const session = await event.locals.auth.validate();

	if (!session) redirect(303, '/auth/login');

	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		redirect(302, "/auth/login"); // redirect to login page
	}
}