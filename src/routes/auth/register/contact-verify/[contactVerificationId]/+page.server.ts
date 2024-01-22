import { differenceInMinutes } from 'date-fns'
import { error, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import {
    sendEmailVerificationCode,
    sendPhoneVerificationCode,
    checkEmailVerificationCode,
    checkPhoneVerificationCode
} from '$lib/server/auth/contact-verification';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';

export const load = (async ({ params, locals }) => {
    const session = await locals.auth.validate();
    // if user logged in, redirect
    if (session) {
        redirect(303, '/');
    }

    const contactVerification = await prisma.contactVerification.findUnique({ where: { id: params.contactVerificationId } })

    // if there is no verification present in db already, throw error
    if (contactVerification === null) {
        error(404, { message: 'could not find verification' });
    }

    const { email, phone } = contactVerification

    const user = await prisma.user.findFirst({
        where: {
            OR:
                [
                    { email },
                    { phone }
                ]
        }
    })

    // if there is a user associated with the email or phone already, throw error
    if (user !== null) {
        error(404, { message: 'info already verified for another user' });
    }

    // otherwise, if email and phone have already been verified, create new user with associated info
    if (!!contactVerification.emailVerifiedAt && !!contactVerification.phoneVerifiedAt) {
        console.log('create a new user and redirect')

        await createUser(email, phone)

        redirect(303, '/auth/login');
    }

    if (
        contactVerification.emailVerificationCodeSentAt === null ||
        differenceInMinutes(new Date(), contactVerification.emailVerificationCodeSentAt) >= 5
    ) {
        sendEmailVerificationCode(contactVerification.email, contactVerification.id)
    }

    if (
        contactVerification.phoneVerificationCodeSentAt === null ||
        differenceInMinutes(new Date(), contactVerification.phoneVerificationCodeSentAt) >= 5
    ) {
        sendPhoneVerificationCode(contactVerification.phone, contactVerification.id)
    }

    return {
        email,
        phone,
        emailVerified: !!contactVerification.emailVerifiedAt,
        phoneVerified: !!contactVerification.phoneVerifiedAt
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    verifyPhone: async ({ params, request }) => {

        console.log('verifying phone...')

        const verification = await prisma.contactVerification.findUnique({ where: { id: params.contactVerificationId } })

        if (verification === null) {
            error(404, 'in-progress verification not found');
        }

        const code = (await request.formData()).get('code') as string

        const verificationSuccessful = await checkPhoneVerificationCode(verification.phone, code)

        if (!verificationSuccessful) {
            return { phoneFailed: true }
        }

        const cv = await prisma.contactVerification.update({ where: { id: params.contactVerificationId }, data: { phoneVerifiedAt: new Date() } })

        console.log(JSON.stringify(cv, undefined, 2))

        return { phoneSuccess: verificationSuccessful }
    },
    verifyEmail: async ({ params, request }) => {

        console.log('verifying email...')

        const verification = await prisma.contactVerification.findUnique({ where: { id: params.contactVerificationId } })

        if (verification === null) {
            error(404, 'in-progress verification not found');
        }

        const code = (await request.formData()).get('code') as string

        const verificationSuccessful = await checkEmailVerificationCode(verification.email, code)

        if (!verificationSuccessful) {
            return { emailFailed: true }
        }

        const cv = await prisma.contactVerification.update({
            where: { id: params.contactVerificationId },
            data: { emailVerifiedAt: new Date() }
        })

        console.log(JSON.stringify(cv, undefined, 2))

        return { emailSuccess: true }

    },
    resendPhone: async ({ params }) => {
        const verification = await prisma.contactVerification.findUnique({ where: { id: params.contactVerificationId } })

        if (verification === null) {
            error(404, 'in-progress verification not found');
        }

        console.log('resending phone verification to :', verification.phone)

        await sendPhoneVerificationCode(verification.phone, verification.id)

        return { phoneResent: true }
    },
    resendEmail: async ({ params }) => {
        const verification = await prisma.contactVerification.findUnique({ where: { id: params.contactVerificationId } })

        if (verification === null) {
            error(404, 'in-progress verification not found');
        }

        console.log('resending email verification to :', verification.email)

        await sendEmailVerificationCode(verification.email, verification.id)

        return { emailResent: true }
    }
}

async function createUser(email: string, phone: string) {
    const createdUser = await auth.createUser({attributes: {
        email,
        phone
    }, key: {
        password: null,
        providerId: 'email',
        providerUserId: email
    }})

    console.log('created new user: ', createdUser.userId)
}