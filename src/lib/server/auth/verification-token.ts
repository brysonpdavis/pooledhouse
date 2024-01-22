import { generateRandomString } from 'lucia/utils'
import { prisma } from '../prisma'

const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = 1000 * 60 * 60 * 2 // 2 hours

export const generateVerificationToken = async (userId: string) => {
    const storedUserToken = await prisma.loginToken.findFirst({
        where: {
            userId,
            expires: {
                gt: new Date()
            }
        },
        orderBy: {
            expires: 'desc'
        }
    })

    if (storedUserToken) {
        return storedUserToken.token
    }

    const token = generateRandomString(64)

    await prisma.loginToken.create({
        data: {
            userId,
            token,
            expires: new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN)
        }
    })

    return token
}

export const validateEmailVerificationToken = async (token: string) => {
    const storedToken = await prisma.loginToken.findFirst({
        where: {
            token,
            expires: {
                gt: new Date()
            }
        }
    })

    if (!storedToken) {
        return null
    }

    const userId = storedToken.userId

    // we can invalidate all tokens since a user only verifies their email once
    await prisma.loginToken.deleteMany({
        where: {
            userId
        }
    })

    return userId
}