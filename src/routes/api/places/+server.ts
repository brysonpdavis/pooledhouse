import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({}) => {
    return new Response(JSON.stringify(await prisma.place.findMany()))
}
