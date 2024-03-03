import type { PageLoad } from './$types'

export const load = (async ({ url }) => {
	return { error: url.searchParams.get('error') }
}) satisfies PageLoad
