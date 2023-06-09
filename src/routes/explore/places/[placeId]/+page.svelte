<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import ExperienceReviewForm from './ExperienceReviewForm.svelte';
	import WorkplaceReviewForm from './WorkplaceReviewForm.svelte';
	import Comment from './Comment.svelte'
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	const workplaceReviewToken = data.reviewToken;

	const workplaceSections: { key: keyof typeof data.comments.workplace; heading: string }[] = [
		{ key: 'general', heading: 'general comments' },
		{ key: 'compensation', heading: 'compensation' },
		{ key: 'culture', heading: "what's the culture like?" },
		{ key: 'guest', heading: 'how are the guests?' }
	];

	const experienceSections: { key: keyof typeof data.comments.experience; heading: string }[] = [
		{ key: 'general', heading: 'general comments' },
		{ key: 'fnb', heading: 'quality of the food and beverage?' },
		{ key: 'vibe', heading: "how's the vibe?" }
	];
</script>

<a href={`/explore/places/${data.place.id}`}>
	<h1>
		{data.place.name}
	</h1>
</a>

<h3 class="text-accent">
	{data.place.address}
</h3>
<div class="flex w-full flex-col xl:flex-row">
	<div class="card-bordered card w-full p-4 xl:w-1/2">
		{#if data.comments.workplace.general.length === 0}
			<div class="card-title">no workplace reviews for this place yet</div>
		{:else}
			<h2 class="mt-0 text-5xl">{data.place.workplaceScore} / 100</h2>
			<div class="card-title">workplace reviews</div>
			{#each workplaceSections as section}
				{@const sectionComments = data.comments.workplace[section.key]}
				{#if sectionComments.length > 0}
					<h3>{section.heading}</h3>
					{#each sectionComments as comment}
						<Comment {comment} />
					{/each}
				{/if}
			{/each}
		{/if}
	</div>

	<div class="card-bordered card w-full p-4 xl:w-1/2">
		{#if data.comments.experience.general.length === 0}
			<div class="card-title">no experience reviews for this place yet</div>
		{:else}
			<h2>{data.place.experienceScore} / 100</h2>
			<div class="card-title">experience reviews</div>
			{#each experienceSections as section}
				{@const sectionComments = data.comments.experience[section.key]}
				{#if sectionComments.length > 0}
					<h3>{section.heading}</h3>
					{#each data.comments.experience[section.key] as comment}
						<div class="card bg-base-200 p-4 shadow-slate-500 hover:shadow-sm">
							<div>{comment.text}</div>
							{#if comment.numberOfReactions > 0}
								<div>{comment.numberOfAgreements} / {comment.numberOfReactions} agree</div>
							{/if}
						</div>
					{/each}
				{/if}
			{/each}
		{/if}
	</div>
</div>

{#if data.userVerified}
	{#if data.previousWorkplaceReview}
		<p class="text-accent">you already wrote a workplace review for this place</p>
		<form method="post" action="?/deleteReview" use:enhance>
			<input name="reviewId" class="hidden" value={data.previousWorkplaceReview.id} />
			<button class="btn-outline btn-secondary btn" type="submit">delete your review</button>
		</form>
	{:else if workplaceReviewToken}
		<h3>have you worked at this establishment?</h3>
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
