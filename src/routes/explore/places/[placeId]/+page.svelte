<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import ExperienceReviewForm from './ExperienceReviewForm.svelte';
	import WorkplaceReviewForm from './WorkplaceReviewForm.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const workplaceReviewToken = data.reviewToken;

	let reviewType: 'workplace' | 'experience' = 'workplace';
</script>

<a href={`/explore/places/${data.place.id}`}>
	<h1>
		{data.place.name}
	</h1>
</a>

<h3 class="text-accent">
	{data.place.address}
</h3>
{#if reviewType === 'workplace'}
	<div class="w-fit py-4">
		{#if data.place.workplaceReviews.length === 0}
			<div class="card-title">no workplace reviews for this place yet</div>
		{:else}
			<div class="card-title">workplace reviews</div>
			{#each data.place.workplaceReviews as review}
				<div class="card-bordered card p-4 shadow-lg">
					<div>rating: {review.overallRating}</div>
					<div>description: {review.description}</div>
				</div>
			{/each}
		{/if}
	</div>
{/if}

{#if reviewType === 'experience'}
	<div class="w-fit py-4">
		{#if data.place.experienceReviews.length === 0}
			<div class="card-title">no experience reviews for this place yet</div>
		{:else}
			<div class="card-title">experience reviews</div>
			{#each data.place.workplaceReviews as review}
				<div class="card-bordered card p-4 shadow-lg">
					<div>rating: {review.overallRating}</div>
					<div>description: {review.description}</div>
				</div>
			{/each}
		{/if}
	</div>
{/if}

{#if data.userVerified}
	<h3>have you worked at this establishment?</h3>
	{#if workplaceReviewToken}
		<Modal id="review" buttonText="workplace review">
			<WorkplaceReviewForm
				placeId={data.place.id}
				successfullyPosted={form?.postReviewSuccess}
				{workplaceReviewToken}
			/>
		</Modal>
	{:else}
		<p>you're out of workplace reviews :(</p>
	{/if}
	<h3>have you visited this establishment?</h3>
	<Modal id="review" buttonText="experience review">
		<ExperienceReviewForm placeId={data.place.id} successfullyPosted={form?.postReviewSuccess} />
	</Modal>
{/if}
