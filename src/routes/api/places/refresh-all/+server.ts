import type { RequestHandler } from './$types'
import { prisma } from '$lib/server/prisma'

export const POST: RequestHandler = async ({ fetch }) => {
	const allPlaces = await prisma.place.findMany({ select: { id: true } })

	const refreshResults = await Promise.all(
		allPlaces.map(async (place) => {
			return (await fetch(`/api/places/${place.id}/refresh`, { method: 'POST' })).json()
		})
	)

	return new Response(JSON.stringify(refreshResults))
}
