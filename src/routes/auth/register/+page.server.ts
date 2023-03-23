import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod'
import validator from 'validator'
import { prisma } from '$lib/server/prisma';

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
    default: async ({ request }) => {
        const formData = await request.formData()

        const credentials = {
            email: formData.get('email'),
            phone: `${formData.get('country-code')}${formData.get('phone')}`
        }

        const validatedCredentials = credentialsSchema.safeParse(credentials)

        if (validatedCredentials.success) {
            await prisma.user.create({
                data: {
                    email: validatedCredentials.data.email,
                    phone: validatedCredentials.data.phone,
                }
            })
        } else {
            throw error(400, validatedCredentials.error.issues[0].message)
        }

    }
}