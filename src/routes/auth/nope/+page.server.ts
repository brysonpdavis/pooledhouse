import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const session = await event.locals.getSession();

	if (session?.expires) throw redirect(303, '/protected');

	return {};
}) satisfies PageServerLoad;
