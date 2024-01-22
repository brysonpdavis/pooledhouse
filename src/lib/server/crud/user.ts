import type { RequestEvent } from "@sveltejs/kit";
import { prisma } from "../prisma";

export const findUserByRequestEvent = async (event: RequestEvent) => {
        const sessionUser = (await event.locals.auth.validate())?.user

        if (!sessionuser?.userId) {
            return null
        }

        const user = await prisma.user.findUnique({where: {email: sessionuser?.userId}})

        return user
}