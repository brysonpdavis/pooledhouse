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

    const workplaceOverallRatings = reviewScores.workplaceReviews.map(wr => wr.overallRating)

    const workplaceOverallAverage = averageOrNull(workplaceOverallRatings)

    console.log('overall workplace rating: ', workplaceOverallAverage)

    const workplaceCompensationRatings = reviewScores.workplaceReviews.map(wr => wr.compensationRating).filter(notNull)

    const workplaceCompensationAverage = averageOrNull(workplaceCompensationRatings)

    console.log('compensation rating: ', workplaceCompensationAverage)

    const experienceOverallRatings = reviewScores.experienceReviews.map(er => er.overallRating)

    const experienceOverallAverage = averageOrNull(experienceOverallRatings)

    console.log('experience overall rating: ', experienceOverallAverage)

    const experienceFnbRatings = reviewScores.experienceReviews.map(er => er.fnbRating).filter(notNull)

    const experienceFnbAverage = averageOrNull(experienceFnbRatings)

    console.log('fnb rating: ', experienceFnbAverage)

    const experienceVibeRatings = reviewScores.experienceReviews.map(er => er.vibeRating).filter(notNull)

    const experienceVibeAverage = averageOrNull(experienceVibeRatings)

    console.log('vibe rating: ', experienceVibeAverage)

    const refreshResult = await prisma.place.update({
        where: { id: placeId },
        data: {
            compensationScore: workplaceCompensationAverage,
            workplaceScore: workplaceOverallAverage,
            experienceScore: experienceOverallAverage
        }
    })

    return new Response(JSON.stringify(refreshResult));
};

function averageOrNull(xs: (number)[]) {
    if (xs.length === 0) return null

    return xs.reduce((prev, x) => prev + x, 0) / xs.length
}

function notNull<T>(value: T | null): value is T {
    return value !== null
}