import type { RequestEvent } from '@sveltejs/kit'
import { prisma } from '../prisma'

export const findUserByRequestEvent = async (event: RequestEvent) => {
	const sessionUser = (await event.locals.auth.validate())?.user

	if (!sessionUser?.userId) {
		return null
	}

	const user = await prisma.user.findUnique({ where: { email: sessionUser?.userId } })

	return user
}
