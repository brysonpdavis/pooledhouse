import type {PageServerLoad} from './$types'
import { prisma } from '$lib/server/prisma'

export const load = (async ({params: {userId}}) => {

    const users = await prisma.user.findMany()

    return {users, userId}
    
}) satisfies PageServerLoad