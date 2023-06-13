import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {

	throw redirect(303, '/auth/login?redirectFrom=nope');

}) satisfies PageServerLoad;
