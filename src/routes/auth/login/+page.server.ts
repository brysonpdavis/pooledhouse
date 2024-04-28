import { redirect, type Actions, fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { LuciaError } from 'lucia'
import { sendVerificationRequest } from '$lib/server/auth/send-email-verification-request'
import { ResendError } from '$lib/server/resend'

export const load = (async (event) => {
	const session = await event.locals.auth.validate()

	if (session) {
		redirect(302, '/profile?fromLogin')
	}

	return {}
}) satisfies PageServerLoad

export const actions: Actions = {
	login: async ({ request }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string

		if (typeof email !== 'string' || email.length < 1) {
			return fail(400, { message: 'Invalid email' })
		}

		try {
			await sendVerificationRequest(email)
			redirect(302, '/auth/sent')
		} catch (e) {
			if (e instanceof LuciaError && e.message === 'AUTH_INVALID_KEY_ID') {
				return fail(400, { message: 'Invalid email' })
			}

			if (e instanceof ResendError) {
				return fail(500, { message: 'Oh no! There was an internal server error!' })
			}

			throw e
		}
	}
}
