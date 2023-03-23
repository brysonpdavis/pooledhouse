import { prisma } from "../prisma";

export async function lookupUserByPhoneNumber(phoneNumber: string) {
    return (await prisma.user.findUnique({where: {phone: phoneNumber}})) 
} 