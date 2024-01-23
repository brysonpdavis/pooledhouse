import type { Handler } from "$lib/types/handlers";
import type { Place } from "@prisma/client";

export type PostPlaceInput = {
    lat: number,
    lng: number,
    name: string,
    googlePlaceId: string,
    address: string,
    createdByUserId: string
}

export const postPlace: Handler<PostPlaceInput, Place> = async (placeData) => {
    const res = await fetch('/api/protected/places', {
        method: 'POST',
        body: JSON.stringify(placeData)
    });

    if (!res.ok) {
        return "error"
    }

    return await res.json() as Place
};

export const getPlaces: Handler<void, Place[]> = async () => {
    const res = await fetch('/api/places', { method: 'GET' });

    if (!res.ok) {
        return "error"
    }

    return await res.json() as Place[]
}

export const deletePlaces: Handler<void, void> = async () => {
    const res = await fetch('/api/protected/places', { method: 'DELETE' })

    if (!res.ok) {
        return "error"
    }
}