import { prisma } from '$lib/server/prisma'
import { error } from '@sveltejs/kit'

export async function upsertReaction(userEmail: string, commentId: string, agree: boolean) {

    const userId = (await prisma.user.findUnique({ where: { email: userEmail } }))?.id

    if (!userId) {
        throw error(404, 'user not found')
    }

    const reactions = await prisma.reviewCommentReaction.findMany({ where: { reviewCommentId: commentId } })

    const existingReaction = reactions.find(r => r.userId === userId)

    if (existingReaction) {
        if (existingReaction.agree === agree) {
            return
        }

        await prisma.$transaction([
            prisma.reviewComment.update({
                where: { id: commentId as string },
                data: {
                    numberOfAgreements: { increment: agree ? 1 : -1 },
                    reactionScore: calculateReactionScore({
                        reactions: reactions.length,
                        agreements: reactions.filter(r => r.agree).length + (agree ? 1 : -1)
                    })
                }
            }),
            prisma.reviewCommentReaction.update({
                where: { id: existingReaction.id },
                data: { agree: agree }
            })
        ])

        return
    }

    await prisma.reviewComment.update({
        where: { id: commentId as string },
        data: {
            numberOfAgreements: { increment: agree ? 1 : 0 },
            numberOfReactions: { increment: 1 },
            reactionScore: agree ? 1 : -1,
            reactions: { create: { agree: agree, user: { connect: { id: userId } } } }
        }
    })

    return

}

function calculateReactionScore({ reactions, agreements }: { reactions: number, agreements: number }): number {
    return ((2 * agreements) - reactions) / reactions
}