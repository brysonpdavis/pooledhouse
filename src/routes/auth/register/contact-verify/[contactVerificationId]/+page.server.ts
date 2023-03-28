import { error, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { twilio } from '$lib/server/twilio';
import type { PageServerLoad, Actions } from './$types';
import { TWILIO_VERIFY_SID } from '$env/static/private';
import { differenceInHours } from 'date-fns'

export const load = (async ({ params, locals }) => {

    // if user logged in, redirect
    if ((await locals.getSession())?.user) {
        throw redirect(303, '/')
    }

    const contactVerification = await prisma.contactVerification.findUnique({ where: { id: params.contactVerificationId } })

    // if there is no verification present in db already, throw error
    if (contactVerification === null) {
        throw error(404, { message: 'could not find verification' })
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
        throw error(404, { message: 'info already verified for another user' })
    }

    // otherwise, if email and phone have already been verified, create new user with associated info
    if (!!contactVerification.emailVerifiedAt && !!contactVerification.phoneVerifiedAt) {
        console.log('create a new user and redirect!!')
        // TODO: create new user

        const createdUser = await prisma.user.create({ data: { email, phone } })

        console.log('created new user: ', createdUser)

        throw redirect(303, '/auth/login')
    }

    if (
        contactVerification.emailVerificationCodeSentAt === null ||
        differenceInHours(new Date(), contactVerification.emailVerificationCodeSentAt) >= 24
    ) {
        sendEmailVerificationCode(contactVerification.email, contactVerification.id)
    }

    if (
        contactVerification.phoneVerificationCodeSentAt === null ||
        differenceInHours(new Date(), contactVerification.phoneVerificationCodeSentAt) >= 24
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
            throw error(404, 'in-progress verification not found')
        }

        const code = (await request.formData()).get('code') as string

        if (code === '') {
            return { phoneFailed: true }
        }

        const verificationSuccessful = await checkPhoneVerificationCode(verification.phone, code)

        if (verificationSuccessful) {
            const cv = await prisma.contactVerification.update({ where: { id: params.contactVerificationId }, data: { phoneVerifiedAt: new Date() } })

            console.log(JSON.stringify(cv), undefined, 2)
        }

        return { phoneSuccess: verificationSuccessful }
    },
    verifyEmail: async ({ params, request }) => {

        console.log('verifying email...')

        const verification = await prisma.contactVerification.findUnique({ where: { id: params.contactVerificationId } })

        if (verification === null) {
            throw error(404, 'in-progress verification not found')
        }

        const code = (await request.formData()).get('code') as string

        if (code === '') {
            return { emailFailed: true }
        }

        const verificationSuccessful = await checkEmailVerificationCode(verification.email, code)

        if (!verificationSuccessful) {
            return { emailFailed: true }
        }

        const cv = await prisma.contactVerification.update({
            where: { id: params.contactVerificationId },
            data: { emailVerifiedAt: new Date() }
        })

        console.log(JSON.stringify(cv), undefined, 2)

        return { emailSuccess: true }

    },
    resendPhone: async ({ params }) => {
        const verification = await prisma.contactVerification.findUnique({ where: { id: params.contactVerificationId } })

        if (verification === null) {
            throw error(404, 'in-progress verification not found')
        }

        await sendPhoneVerificationCode(verification.phone, verification.id)

        return { phoneResent: true }
    },
    resendEmail: async ({ params }) => {
        const verification = await prisma.contactVerification.findUnique({ where: { id: params.contactVerificationId } })

        if (verification === null) {
            throw error(404, 'in-progress verification not found')
        }

        await sendEmailVerificationCode(verification.email, verification.id)

        return { emailResent: true }
    }
}

async function sendPhoneVerificationCode(phone: string, contactVerificationId: string) {
    await twilio.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verifications
        .create({ to: phone, channel: 'sms' })
        .catch(console.warn)

    await prisma.contactVerification.update({ where: { id: contactVerificationId }, data: { phoneVerificationCodeSentAt: new Date() } })
}

async function checkPhoneVerificationCode(phone: string, code: string) {
    const verificationCheck = await twilio.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verificationChecks
        .create({ to: phone, code })
        .catch(console.warn)

    return verificationCheck?.status === 'approved'
}

async function sendEmailVerificationCode(email: string, contactVerificationId: string) {
    await twilio.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verifications
        .create({ to: email, channel: 'email' })
        .catch(console.warn)

    await prisma.contactVerification.update({ where: { id: contactVerificationId }, data: { emailVerificationCodeSentAt: new Date() } })
}

async function checkEmailVerificationCode(email: string, code: string) {
    const verificationCheck = await twilio.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verificationChecks
        .create({ to: email, code })
        .catch(console.warn)

    return verificationCheck?.status === 'approved'
}
