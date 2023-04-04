import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET = (async ({}) => {
    return new Response(JSON.stringify(await prisma.place.findMany()))
}) satisfies RequestHandler
