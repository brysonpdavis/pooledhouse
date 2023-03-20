<script lang="ts">
	import type { Place, Prisma } from '@prisma/client';
	import { page } from '$app/stores';

	const loggedIn = $page.data.session?.user;

	let places: Place[] = [];

	const handlePost = async () => {
		const res = await fetch('/api/protected/places', {
			method: 'POST',
			body: JSON.stringify({
				googlePlaceId: (Math.random() * 10000).toString(),
				name: 'something',
				lat: 50,
				lng: -50,
				address: '12345 awesome rd',
				createdByUser: {connect: {email: $page.data.session?.user?.email!}}
			} satisfies Prisma.PlaceCreateInput)
		});

		if (res.ok) {
			places.push(await res.json());
			places = places;
		}
	};

	const fetchPlaces = async () => {
		const res = await fetch('/api/protected/places', { method: 'GET' });

		if (res.ok) {
			places = await res.json();
		}
	};

	const deletePlaces = async () => {
		const res = await fetch('/api/protected/places', { method: 'DELETE' });

		if (res.ok) {
			places = [];
		}
	};
</script>

<div>
	<h1>welcome to pooledhouse</h1>
	<a class="hover:btn-primary-focus btn-primary btn" href="/map">go to map</a>

	<hr />

	<div>
		<button disabled={!loggedIn} on:click={fetchPlaces} class="btn-primary btn">get</button>
		<button disabled={!loggedIn} on:click={handlePost} class="btn-primary btn">post</button>
		<button disabled={!loggedIn} on:click={deletePlaces} class="btn-primary btn">delete</button>
	</div>

	{#if places.length !== 0}
		{#each places as place}
			<h1>
				name: {place.name}
			</h1>
			<p>
				google id: {place.googlePlaceId}
			</p>
			<p>
				id: {place.id}
			</p>
			<p>
				location: ({place.lat}
				{place.lng})
			</p>
		{/each}
	{/if}
</div>
