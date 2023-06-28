import {z} from 'zod'
import { prisma } from '$lib/server/prisma'

export const postWorkplaceReviewFormDataSchema = z.object({
    general: z.string().min(10, 'description is too short, min character count is 10').max(2000, 'description is too long, max character count is 2000'),
    rating: z.coerce.number().int().min(0).max(100),
    compensation: z.coerce.number().int().min(0).max(100).optional(),
    compensationDescription: z.string().max(1000, 'compensation description is too long, max character count is 1000').optional(),
    guestDescription: z.string().max(1000, 'guest description is too long, max character count is 1000').optional(),
    cultureDescription: z.string().max(1000, 'culture description is too long, max character count is 1000').optional(),
    idealFor: z.string().max(1000, '"ideal for" description is too long, max character count is 1000').optional(),
    workplaceReviewToken: z.string().min(1).refine(async (t) => {
        const availableToken = await prisma.workplaceReviewToken.findUnique({ where: { token: t }, include: { workplaceReview: true } })

        return !!availableToken && availableToken.workplaceReview === null
    }, 'not a valid workplace review token')
})
