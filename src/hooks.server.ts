import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from '@auth/core/providers/email';
import { prisma } from '$lib/server/prisma';
import { sendVerificationRequest } from '$lib/server/auth/send-verification-request';
import { sequence } from '@sveltejs/kit/hooks';

import { SENDGRID_API_KEY } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

export const handle = sequence(
	// authenticate
	SvelteKitAuth({
		adapter: PrismaAdapter(prisma),
		providers: [
			EmailProvider({
				server: `smtp://apikey:${SENDGRID_API_KEY}@smtp.sendgrid.net:587`,
				from: 'hey@brysondavis.dev',
				type: 'email',
				id: 'email',
				sendVerificationRequest,
				name: 'Sign in with Email'
			})
		],
		callbacks: {
			// TODO: if want to make sign in only possible when user already
			// has an account, that logic goes here
			signIn: () => {
				return true;
			}
		},
		pages: {
			verifyRequest: '/auth/sent'
		}
	}),
	// authorize
	async ({ event, resolve }) => {
		const protectedApiRoute = event.url.pathname.startsWith('/api/protected')

		if (protectedApiRoute && !(await event.locals.getSession())?.user) {
			throw error(401, {message: 'you need to be logged in to access this endpoint'})
		}

		const protectedPage = event.url.pathname.startsWith('/protected')

		if (protectedPage && !(await event.locals.getSession())?.user) {
			redirect(302, 'not allowed')
		}

		return resolve(event)
	}
)