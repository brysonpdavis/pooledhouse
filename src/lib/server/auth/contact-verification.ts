import { prisma } from "$lib/server/prisma"
import { twilio } from "$lib/server/twilio"
import { TWILIO_VERIFY_SID } from "$env/static/private"
import type { Prisma } from "@prisma/client"

export const createOrFindContactVerification = async (contactInfo: { email: string, phone: string }, industryVerificationToken: string | null) => {
    let existingContactVerification = await prisma.contactVerification.findUnique({
        where: {
            email_phone: {
                email: contactInfo.email,
                phone: contactInfo.phone
            }
        }
    })

    const industryVerificationTokenDetails = !!industryVerificationToken ?
        { connect: { token: industryVerificationToken } } :
        undefined satisfies Prisma.ContactVerificationCreateInput['industryVerificationTokenDetails']


    if (existingContactVerification === null) {
        existingContactVerification = await prisma.contactVerification.create({
            data: {
                email: contactInfo.email,
                phone: contactInfo.phone,
                industryVerificationTokenDetails
            }
        })
    }

    // if the existing contact verification record has no industry verification token, and
    // an industry verification token has been provided, update the contact verification record 
    if (
        existingContactVerification.industryVerificationToken === null &&
        industryVerificationToken !== null
    ) {
        try {
            existingContactVerification = await prisma.contactVerification.update({
                where: { id: existingContactVerification.id },
                data: { industryVerificationTokenDetails: { connect: { token: industryVerificationToken } } }
            })
        } catch (err) {
            console.error('error occured attempting to update contact verification with industry token:')
            console.error(err)
        }
    }

    return existingContactVerification
}

export async function sendPhoneVerificationCode(phone: string, contactVerificationId?: string) {
    await twilio.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verifications
        .create({ to: phone, channel: 'sms' })
        .catch(console.warn)

    if (contactVerificationId !== undefined) {
        await prisma.contactVerification.update({ where: { id: contactVerificationId }, data: { phoneVerificationCodeSentAt: new Date() } })
    }
}

export async function checkPhoneVerificationCode(phone: string, code: string) {
    const verificationCheck = await twilio.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verificationChecks
        .create({ to: phone, code })
        .catch(console.warn)

    return verificationCheck?.status === 'approved'
}

export async function sendEmailVerificationCode(email: string, contactVerificationId: string) {
    await twilio.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verifications
        .create({ to: email, channel: 'email' })
        .catch(console.warn)

    await prisma.contactVerification.update({ where: { id: contactVerificationId }, data: { emailVerificationCodeSentAt: new Date() } })
}

export async function checkEmailVerificationCode(email: string, code: string) {
    const verificationCheck = await twilio.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verificationChecks
        .create({ to: email, code })
        .catch(console.warn)

    return verificationCheck?.status === 'approved'
}
