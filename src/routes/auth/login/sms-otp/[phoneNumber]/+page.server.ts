import { error, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { z } from 'zod'
import validator from 'validator'
import { sendPhoneVerificationCode } from '$lib/server/auth/contact-verification'

const phoneNumberSchema = z
	.string()
	.refine(
		(x) => validator.isMobilePhone(x, 'any', { strictMode: true }),
		'not a valid phone number'
	)

export const load = (async (event) => {
	const session = await event.locals.auth.validate()

	if (session) redirect(303, '/profile')

	const phone = event.params.phoneNumber

	const parsedPhone = phoneNumberSchema.safeParse(phone)

	if (!parsedPhone.success) {
		error(400, { message: 'not a valid phone number' })
	}

	await sendPhoneVerificationCode(parsedPhone.data)

	return { phone: parsedPhone.data }
}) satisfies PageServerLoad

export const actions: Actions = {
	login: async () => {
		// TODO: implement phone otp login
	}
}
