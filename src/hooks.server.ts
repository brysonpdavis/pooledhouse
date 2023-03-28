import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from '@auth/core/providers/email';
import CredentialsProvider from '@auth/core/providers/credentials';
import { prisma } from '$lib/server/prisma';
import { sendVerificationRequest } from '$lib/server/auth/send-email-verification-request';
import { sequence } from '@sveltejs/kit/hooks';

import { SENDGRID_API_KEY } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import { lookupUserByPhoneNumber } from '$lib/server/auth/phone-authorization';

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
				name: 'Email'
			}),
			CredentialsProvider({
				id: 'phoneNumber',
				name: 'Phone Number',
				type: "credentials",
				credentials: {
					phoneNumber: {label: "Phone Number", type: "text"}
				},
				authorize: async ({phoneNumber}) => {

					// TODO: implement actual auth

					return lookupUserByPhoneNumber(phoneNumber as string)
				}
			})
		],
		callbacks: {
			// TODO: if want to make sign in only possible when user already
			// has an account, that logic goes here
			signIn: async ({credentials, email, user}) => {
				
				if (credentials && credentials.phoneNumber) {
					if (await prisma.user.findUnique({where: {phone: String(credentials.phoneNumber.value)}})) {
						return true
					}
				}

				if (email && user.email && email.verificationRequest) {
					if (await prisma.user.findUnique({where: {email: user.email}})) {
						return true
					} else {
						return false
					}
				}

				return true;
			},
		},
		pages: {
			signIn: '/auth/login',
			verifyRequest: '/auth/sent',
			error: '/error'
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
			redirect(302, '/auth/nope')
		}

		return resolve(event)
	}
)