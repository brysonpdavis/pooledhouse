import type { PageServerLoad } from './$types'
import { prisma } from '$lib/server/prisma'
import { error } from '@sveltejs/kit'

export const load = (async ({ locals }) => {
	const userId = (await locals.auth.validate())?.user?.userId

	if (!userId) {
		return { userVerified: false }
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { workplaceReviewTokens: { include: { workplaceReview: { select: { id: true } } } } }
	})

	if (!user) {
		error(404, 'unexpected error')
	}

	const unusedWorkplaceReviewTokens = user?.workplaceReviewTokens.filter(
		({ workplaceReview }) => workplaceReview === null
	)

	return {
		userVerified: user.industryVerificationToken !== null,
		reviewToken: unusedWorkplaceReviewTokens.at(0)?.token
	}
}) satisfies PageServerLoad
