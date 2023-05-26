import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params: { placeId } }) => {
    const reviewScores = await prisma.place.findUnique({
        where: { id: placeId },
        select: {
            name: true,
            experienceReviews: { select: { overallRating: true, fnbRating: true, vibeRating: true } },
            workplaceReviews: { select: { overallRating: true, compensationRating: true } }
        }
    })

    if (!reviewScores) {
        return new Response()
    }

    console.log('place: ', reviewScores.name)

    const workplaceOverallAverage = reviewScores.workplaceReviews.reduce((prev, wr) => wr.overallRating + prev, 0) / reviewScores?.workplaceReviews.length

    console.log('overall workplace rating: ', workplaceOverallAverage)

    const workplaceCompensationRatings = reviewScores.workplaceReviews.filter(wr => wr.compensationRating !== null)

    const workplaceCompensationAverage = workplaceCompensationRatings.reduce((prev, wr) => prev + wr.compensationRating!, 0) / workplaceCompensationRatings.length

    console.log('compensation rating: ', workplaceCompensationAverage)

    const experienceOverallAverage = reviewScores.experienceReviews.reduce((prev, er) => er.overallRating + prev, 0) / reviewScores.experienceReviews.length

    console.log('experience overall rating: ', experienceOverallAverage)

    const experienceFnbRatings = reviewScores.experienceReviews.filter(er => er.fnbRating !== null)

    const experienceFnbAverage = experienceFnbRatings.reduce((prev, er) => prev + er.fnbRating!, 0)

    console.log('fnb rating: ', experienceFnbAverage)

    const experienceVibeRatings = reviewScores.experienceReviews.filter(er => er.vibeRating !== null)

    const experienceVibeAverage = experienceVibeRatings.reduce((prev, er) => prev + er.vibeRating!, 0)

    console.log('vibe rating: ', experienceVibeAverage)

    const refreshResult = await prisma.place.update({
        where: { id: placeId },
        data: {
            workplaceScore: workplaceOverallAverage,
            experienceScore: experienceOverallAverage
        }
    })

    return new Response(JSON.stringify(refreshResult));
};