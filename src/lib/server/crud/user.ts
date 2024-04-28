import type { RequestEvent } from '@sveltejs/kit'
import { prisma } from '../prisma'

export const findUserByRequestEvent = async (event: RequestEvent) => {
	const session = await event.locals.auth.validate()

	const sessionUser = session?.user

	if (!sessionUser?.userId) {
		return null
	}

	const user = await prisma.user.findUnique({ where: { id: sessionUser?.userId } })

	return user
}
