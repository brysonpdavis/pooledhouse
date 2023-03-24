import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod'
import validator from 'validator'
import { prisma } from '$lib/server/prisma';
import { twilio } from '$lib/server/twilio';
import { TWILIO_VERIFY_SID } from '$env/static/private';

export const load = (async ({ locals }) => {
    if ((await locals.getSession())?.user) {
        redirect(302, '/')
    }

    return
}) satisfies PageServerLoad;

const credentialsSchema = z.object({
    email: z.string().email("not a valid email"),
    phone: z.string().refine((x) => validator.isMobilePhone(x, 'en-US',), 'not a valid phone number')
})

export const actions = {
    register: async ({ request }) => {
        const formData = await request.formData()

        const credentials = {
            email: formData.get('email'),
            phone: `${formData.get('country-code')}${formData.get('phone')}`
        }

        const validatedCredentials = credentialsSchema.safeParse(credentials)

        if (validatedCredentials.success) {

            // const user = await prisma.user.create({
            //     data: {
            //         email: validatedCredentials.data.email,
            //         phone: validatedCredentials.data.phone,
            //     }
            // })
            const user = {id: '12345'}

            console.log('creating new user...')

            await twilio.verify.v2.services(TWILIO_VERIFY_SID).verifications.create({ to: validatedCredentials.data.phone, channel: 'sms'})

            return new Response(JSON.stringify({
                userId: user.id
            }), {status: 200})
        } else {
            throw error(400, validatedCredentials.error.issues[0].message)
        }

    },
    verify: async ({}) => {

    } 
}