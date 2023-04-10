import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params: { placeId } }) => {
    // TODO: fill in this handler with logic to recompute score average

    const refreshResult = await prisma.place.update({where: {id: placeId}, data: {}})

    return new Response(JSON.stringify(refreshResult));
};