import { prisma } from "$lib/server/prisma"
import { twilio } from "$lib/server/twilio"
import { TWILIO_VERIFY_SID } from "$env/static/private"

export const createOrFindContactVerification = async (contactInfo: { email: string, phone: string }) => {
    let verification = await prisma.contactVerification.findUnique({
        where: {
            email_phone: {
                email: contactInfo.email,
                phone: contactInfo.phone
            }
        }
    })

    if (verification === null) {
        verification = await prisma.contactVerification.create({
            data: {
                email: contactInfo.email,
                phone: contactInfo.phone
            }
        })
    }
    
    return verification
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
