import { prisma } from '$lib/server/prisma'
import type {PostPlaceInput} from '$lib/handlers/places'

export const POST = async ({ request, locals }) => {
    if (!locals.authorized) {
        return new Response("{}", {status: 403, statusText: 'forbidden'})
    }

    const postedPlace = await request.json() as PostPlaceInput
    const res = await prisma.place.create({
        data: {
            googlePlaceId: postedPlace.googlePlaceId,
            address: postedPlace.address,
            lat: postedPlace.lat,
            lng: postedPlace.lng,
            name: postedPlace.name,
            createdByUser: {
                connect: {
                    email: postedPlace.createdByUserEmail
                }
            }
        }
    })
    console.log('new place', res)
    return new Response(JSON.stringify(res));
}

export const GET = async ({ locals }) => {
    if (!locals.authorized) {
        return new Response("{}", {status: 403, statusText: 'forbidden'})
    }
    console.log('get request')
    return new Response(JSON.stringify(await prisma.place.findMany()))
}

export const DELETE = async ({locals}) => {
    if (!locals.authorized) {
        return new Response("{}", {status: 403, statusText: 'forbidden'})
    }

    await prisma.place.deleteMany()

    return new Response(JSON.stringify({}))
}