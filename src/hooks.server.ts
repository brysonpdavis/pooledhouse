import { auth } from '$lib/server/lucia'
import { sequence } from '@sveltejs/kit/hooks'
import { error } from '@sveltejs/kit'

// import { lookupUserByPhoneNumber } from '$lib/server/auth/phone-authorization';
// import { checkPhoneVerificationCode } from '$lib/server/auth/contact-verification';

export const handle = sequence(
	// authenticate
	async ({ event, resolve }) => {
		event.locals.auth = auth.handleRequest(event)
		return await resolve(event)
	},
	// authorize
	async ({ event, resolve }) => {
		const protectedApiRoute = event.url.pathname.startsWith('/api/protected')

		if (protectedApiRoute && !(await event.locals.auth.validate())?.user) {
			error(401, { message: 'you need to be logged in to access this endpoint' })
		}

		return resolve(event)
	}
)
