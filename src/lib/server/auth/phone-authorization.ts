import { prisma } from '$lib/server/prisma'

export async function lookupUserByPhoneNumber(phoneNumber: string) {
	return await prisma.user.findUnique({ where: { phone: phoneNumber } })
}
