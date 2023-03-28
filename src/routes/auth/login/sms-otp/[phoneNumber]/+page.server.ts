import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, } from './$types';
import { z } from 'zod'
import validator from 'validator';
import { sendPhoneVerificationCode } from '$lib/server/auth/contact-verification';

const phoneNumberSchema = z.string().refine((x) => validator.isMobilePhone(x, 'en-US', {strictMode: true}), 'not a valid phone number')

export const load = (async (event) => {
	const session = await event.locals.getSession();

	if (session?.expires) throw redirect(303, '/protected');

	const phone = event.params.phoneNumber

	const parsedPhone = phoneNumberSchema.safeParse(phone)

	if (!parsedPhone.success) {
		throw error(400, { message: 'not a valid phone number' })
	}

	await sendPhoneVerificationCode(parsedPhone.data)

	return { phone: parsedPhone.data }

}) satisfies PageServerLoad;