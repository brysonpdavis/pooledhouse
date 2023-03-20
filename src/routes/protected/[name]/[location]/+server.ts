import { prisma } from '$lib/server/prisma';
import type { PostPlacePayload } from '$lib/types/places';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    console.log(await prisma.review.findMany())
    return new Response();
};

export const POST: RequestHandler = async ({request}) => {
    const postedPlace = await request.json() as PostPlacePayload
    console.log(await prisma.place.create({data: {
        googlePlaceId: postedPlace.googlePlaceId,
        address: '1234 main st',
        lat: 50.1,
        lng: -29.3,
        name: postedPlace.name
    }}))
    return new Response();
}

