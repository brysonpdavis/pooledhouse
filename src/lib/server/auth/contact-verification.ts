import { addDays } from "date-fns"
import { prisma } from "$lib/server/prisma"

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