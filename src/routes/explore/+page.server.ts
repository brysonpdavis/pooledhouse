import { prisma } from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {
		places: await prisma.place.findMany()
	}
}) satisfies PageServerLoad
