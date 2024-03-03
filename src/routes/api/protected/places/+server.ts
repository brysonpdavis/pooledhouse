import { prisma } from '$lib/server/prisma'
import type { PostPlaceInput } from '$lib/handlers/places'
import type { RequestHandler } from './$types'

export const POST = (async ({ request }) => {
	const postedPlace = (await request.json()) as PostPlaceInput
	const res = await prisma.place.create({
		data: {
			googlePlaceId: postedPlace.googlePlaceId,
			address: postedPlace.address,
			lat: postedPlace.lat,
			lng: postedPlace.lng,
			name: postedPlace.name,
			createdByUser: {
				connect: {
					id: postedPlace.createdByUserId
				}
			}
		}
	})
	return new Response(JSON.stringify(res))
}) satisfies RequestHandler

export const DELETE = (async () => {
	await prisma.place.deleteMany()

	return new Response(JSON.stringify({}))
}) satisfies RequestHandler
