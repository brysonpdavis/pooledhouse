import { prisma } from '$lib/server/prisma'

export const POST = async () => {
	const allPlaces = await prisma.place.findMany({ select: { id: true } })

	const results = await Promise.all(
		allPlaces.map(async (place) => {
			return await prisma.place.update({
				where: { id: place.id },
				data: {
					experienceScore: null,
					workplaceScore: null
				}
			})
		})
	)

	return new Response(JSON.stringify(results))
}
