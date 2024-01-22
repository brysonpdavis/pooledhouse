import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod'
import validator from 'validator'
import { prisma } from '$lib/server/prisma';
import { createOrFindContactVerification } from '$lib/server/auth/contact-verification';

export const load = (async ({ locals }) => {
    const session = await locals.auth.validate();

    if (session) {
        redirect(303, '/');
    }

    return {}
}) satisfies PageServerLoad;

const credentialsSchema = z.object({
    email: z.string().email("not a valid email"),
    phone: z.string().refine((x) => validator.isMobilePhone(x, 'any',), 'not a valid phone number'),
    code: z.string().max(6, "industry verification code is invalid").nullable().refine(async (token) => {

        if (token === null) {
            return true
        }

        const ivt = await prisma.industryVerificationToken.findFirst({where: {token, consumedByUser: null}})

        return !!ivt
    }, 'industry verification code is invalid')
})

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()

        const credentials = {
            email: formData.get('email'),
            phone: `${formData.get('country-code')}${formData.get('phone')}`,
            code: formData.get('code')
        }

        const validatedCredentials = await credentialsSchema.safeParseAsync(credentials)

        if (validatedCredentials.success === false) {
            return fail(400, {message: validatedCredentials.error.issues[0].message});
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
            return fail(409, { message: 'a user already exists with that info' });
        }

        console.log('creating new verification...')

        const verification = await createOrFindContactVerification(validatedCredentials.data, validatedCredentials.data.code)

        if (verification === null) {
            return fail(404, {message: 'could not create or find contact verification'});
        } else {
            redirect(303, `/auth/register/contact-verify/${verification.id}`);
        }
    }
}