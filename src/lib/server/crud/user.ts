import type { RequestEvent } from "@sveltejs/kit";
import { prisma } from "../prisma";

export const findUserByRequestEvent = async (event: RequestEvent) => {
        const sessionUser = (await event.locals.getSession())?.user

        if (!sessionUser?.email) {
            return null
        }

        const user = await prisma.user.findUnique({where: {email: sessionUser?.email}})

        return user
}