<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import ExperienceReviewForm from './ExperienceReviewForm.svelte';
	import WorkplaceReviewForm from './WorkplaceReviewForm.svelte';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	const workplaceReviewToken = data.reviewToken;

	// let reviewType: 'workplace' | 'experience' = 'workplace';
</script>

<a href={`/explore/places/${data.place.id}`}>
	<h1>
		{data.place.name}
	</h1>
</a>

<h3 class="text-accent">
	{data.place.address}
</h3>
<div class="w-fit py-4">
	{#if data.comments.workplaceOverallComments.length === 0}
		<div class="card-title">no workplace reviews for this place yet</div>
	{:else}
		<h2>{data.place.workplaceScore} / 100</h2>
		<div class="card-title">workplace reviews</div>
		general comments
		{#each data.comments.workplaceOverallComments as comment}
			<div class="card bg-base-200 p-4 hover:shadow-sm shadow-slate-500">
				<div>{comment.text}</div>
				{#if comment.numberOfReactions > 0}
				<div>{comment.numberOfAgreements} / {comment.numberOfReactions} agree</div>
			{/if}
			</div>
		{/each}
	{/if}
</div>

<div class="w-fit py-4">
	{#if data.comments.experienceOverallComments.length === 0}
		<div class="card-title">no experience reviews for this place yet</div>
	{:else}
		<div class="card-title">experience reviews</div>
		<h3>overall</h3>
		{#each data.comments.experienceOverallComments as comment}
			<div class="card bg-base-200 p-2 shadow-lg">
				<div>{comment.text}</div>
			</div>
		{/each}
	{/if}
</div>

{#if data.userVerified}
	<h3>have you worked at this establishment?</h3>
	{#if data.previousWorkplaceReview}
		<p class="text-accent">you already wrote a workplace review for this place</p>
		<form method="post" action="?/deleteReview" use:enhance>
			<input name="reviewId" class="hidden" value={data.previousWorkplaceReview.id} />
			<button class="btn-outline btn-secondary btn" type="submit">delete your review</button>
		</form>
	{:else if workplaceReviewToken}
		<Modal id="workplaceReview" buttonText="workplace review">
			<WorkplaceReviewForm
				zodErrors={form?.workplaceReviewSchemaErrors}
				placeId={data.place.id}
				successfullyPosted={form?.postWorkplaceReviewSuccess}
				{workplaceReviewToken}
			/>
		</Modal>
	{:else}
		<p>you're out of workplace reviews :(</p>
	{/if}
	<h3>have you visited this establishment?</h3>
	{#if data.previousExperienceReview}
		<p>you already wrote an experience review for this place</p>
	{:else}
		<Modal id="experienceReview" buttonText="experience review">
			<ExperienceReviewForm
				placeId={data.place.id}
				successfullyPosted={form?.postExperienceReviewSuccess}
			/>
		</Modal>
	{/if}
{/if}
