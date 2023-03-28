<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<a href={`/explore/places/${data.place.id}`}>
	<h1>
		{data.place.name}
	</h1>
</a>

<h3 class="text-accent">
	{data.place.address}
</h3>

<div class=" w-fit p-4 ">
	{#if data.place.reviews.length === 0}
		<div class="card-title">no reviews for this place yet</div>
	{:else}
		<div class="card-title">reviews</div>
		{#each data.place.reviews as review}
			<div class="card-bordered card p-4 shadow-lg">
				<div>rating: {review.overallRating}</div>
				<div>description: {review.description}</div>
			</div>
		{/each}
	{/if}
</div>

<a
	href={`/explore/places/${data.place.id}/review`}
	class="btn-primary btn"
	class:btn-disabled={!data.userVerified}
>
	write your own review
</a>
