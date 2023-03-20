import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    console.log(await prisma.review.findMany())
    return new Response();
};

export const POST: RequestHandler = async ({}) => {
    return new Response();
}

