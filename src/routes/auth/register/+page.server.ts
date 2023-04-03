import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod'
import validator from 'validator'
import { prisma } from '$lib/server/prisma';
import { createOrFindContactVerification } from '$lib/server/auth/contact-verification';

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

        if (validatedCredentials.success === false) {
            throw error(400, validatedCredentials.error.issues[0].message)
        }

        const user = await prisma.user.findFirst({
            where: {
                OR:
                    [
                        { email: validatedCredentials.data.email },
                        { phone: validatedCredentials.data.phone }
                    ]
            }
        })

        if (user !== null) {
            throw error(409, { message: 'a user already exists with that info' })
        }

        console.log('creating new verification...')

        const verification = await createOrFindContactVerification(validatedCredentials.data)

        if (verification === null) {
            throw error(404, 'could not create or find contact verification')
        } else {
            throw redirect(303, `/auth/register/contact-verify/${verification.id}`)
        }
    }
}