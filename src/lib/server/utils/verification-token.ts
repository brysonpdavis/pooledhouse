import { prisma } from "$lib/server/prisma"
import { addDays } from "date-fns"

const TOKEN_LENGTH = 8

export const createIndustryVerificationToken = async (createdByUserId: string) => {
    return await prisma.industryVerificationToken.create({
        data: {
            createdByUser: { connect: { id: createdByUserId } },
            token: generateToken(TOKEN_LENGTH),
            expires: addDays(new Date(), 365)
        }
    })
}

export const generateToken = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}