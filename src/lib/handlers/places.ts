import type { Handler } from "$lib/types/handlers";
import type { Place, Prisma } from "@prisma/client";

export const postPlace = async (placeData: Prisma.PlaceCreateInput) => {
    const res =  await fetch('/api/protected/places', {
        method: 'POST',
        body: JSON.stringify({
            ...placeData
        })
    });

    if (res.ok) {
        return await res.json()
    }
};

export const getPlaces: Handler<void, Place[]> = async () => {
    const res = await fetch('/api/protected/places', { method: 'GET' });

    if (!res.ok) {
        return "error"
    }

    return await res.json() as Place[]

}