<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import ExperienceReviewForm from './ExperienceReviewForm.svelte';
	import WorkplaceReviewForm from './WorkplaceReviewForm.svelte';
	import Comment from './Comment.svelte';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import type { ReviewCommentReaction } from '@prisma/client';
	import { slide } from 'svelte/transition';
	import { scoreColorGradient } from '$lib/utils/colors';

	export let data: PageData;
	export let form: ActionData;

	let showSection: 'workplace' | 'experience' = 'workplace';

	const usersCommentReactionsByCommentId = data.usersCommentReactions?.reduce(
		(map, cr) => map.set(cr.reviewCommentId, cr),
		new Map<string, ReviewCommentReaction>()
	);

	const workplaceReviewToken = data.reviewToken;

	const workplaceSections: { key: keyof typeof data.comments.workplace; heading: string }[] = [
		{ key: 'general', heading: 'general comments' },
		{ key: 'compensation', heading: 'compensation' },
		{ key: 'culture', heading: "what's the culture like?" },
		{ key: 'guest', heading: 'how are the guests?' }
	];

	// TODO: uncomment this out when experience reviews are implemented
	// const experienceSections: { key: keyof typeof data.comments.experience; heading: string }[] = [
	// 	{ key: 'general', heading: 'general comments' },
	// 	{ key: 'fnb', heading: 'quality of the food and beverage?' },
	// 	{ key: 'vibe', heading: "how's the vibe?" }
	// ];
</script>

<div class="flex flex-col gap-4">
	<a href={`/places/${data.place.id}`}>
		<h1 class="m-0">
			{data.place.name}
		</h1>
	</a>

	<div class="flex w-full flex-col justify-between gap-2 xl:flex-row xl:items-center">
		<h3 class="m-0 text-accent">
			{data.place.address}
		</h3>
		<div class="btn-group btn-group-horizontal">
			<button
				on:click={() => (showSection = 'workplace')}
				class:btn-active={showSection === 'workplace'}
				class="btn-secondary btn flex flex-1 tracking-wider">workplace</button
			>
			<button
				on:click={() => (showSection = 'experience')}
				class:btn-active={showSection === 'experience'}
				class="btn-secondary btn flex flex-1 tracking-wider">visit</button
			>
		</div>
	</div>

	<div class="flex w-full flex-col gap-4">
		{#if showSection === 'workplace'}
			<div
				transition:slide|local={{ axis: 'y' }}
				class="card-bordered card flex flex-grow overflow-hidden border-primary p-4"
			>
				<div class="flex w-full flex-col gap-4">
					<div class="flex flex-col items-center gap-4 xl:flex-row xl:justify-between">
						<div
							class="card-title w-fit text-4xl font-bold uppercase tracking-widest text-base-content"
						>
							workplace reviews
						</div>
						<div class="w-fit rounded-md bg-base-200 p-4 font-mono">
							{#if data.place.workplaceScore !== null}
								<span
									style={`color: #${scoreColorGradient.colorAt(data.place.workplaceScore)};`}
									class="text-5xl"
								>
									{Math.floor(data.place.workplaceScore)}
								</span>
							{:else}
								<span class="text-5xl text-primary"> ??? </span>
							{/if}
							/ 100
						</div>
					</div>
					{#if data.comments.workplace.general.length === 0}
						<div class="card-title justify-center bg-base-200 p-4">
							no workplace reviews for this place yet
						</div>
					{:else}
						{#each workplaceSections as section}
							{@const sectionComments = data.comments.workplace[section.key]}
							{#if sectionComments.length > 0}
								<h3>{section.heading}</h3>
								<div class="flex flex-col gap-2">
									{#each sectionComments as comment (comment.id)}
										<Comment
											{comment}
											usersCommentReaction={usersCommentReactionsByCommentId?.get(comment.id)}
										/>
									{/each}
								</div>
							{/if}
						{/each}
					{/if}
				</div>
			</div>
		{/if}

		{#if showSection === 'experience'}
			<div
				transition:slide|local={{ axis: 'y' }}
				class="card-bordered card flex flex-grow overflow-hidden border-primary p-4"
			>
				<div class="flex w-full flex-col gap-4">
					<div class="flex flex-col items-center gap-4 xl:flex-row xl:justify-between">
						<div
							class="card-title w-fit text-4xl font-bold uppercase tracking-widest text-base-content"
						>
							visit reviews
						</div>
						<div class="w-fit rounded-md bg-base-200 p-4 font-mono">
							{#if data.place.experienceScore !== null}
								<span
									style={`color: #${scoreColorGradient.colorAt(data.place.experienceScore)};`}
									class="text-5xl"
								>
									{Math.floor(data.place.experienceScore)}
								</span>
							{:else}
								<span class="text-5xl text-primary"> ??? </span>
							{/if}
							/ 100
						</div>
					</div>

					<div class="w-full flex-grow bg-base-200 p-4 text-center tracking-wider text-accent">
						customer reviews from verified restaurant workers... coming soon
					</div>
					<!-- {#if data.comments.experience.general.length === 0}
					<div class="card-title">no experience reviews for this place yet</div>
					{:else}
						<h2>
							{data.place.experienceScore !== null ? Math.floor(data.place.experienceScore) : '???'}
							/ 100
						</h2>
						<div class="card-title">experience reviews</div>
						{#each experienceSections as section}
							{@const sectionComments = data.comments.experience[section.key]}
							{#if sectionComments.length > 0}
								<h3>{section.heading}</h3>
								<div class="flex flex-col gap-2">
									{#each sectionComments as comment (comment.id)}
										<Comment
											{comment}
											usersCommentReaction={usersCommentReactionsByCommentId?.get(comment.id)}
										/>
									{/each}
								</div>
							{/if}
						{/each}
					{/if} -->
				</div>
			</div>
		{/if}
	</div>

	<!-- TODO: move this to the place's contribute page -->
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
		<h3>have you visited or worked for this establishment?</h3>
		{#if data.previousExperienceReview}
			<p>you already wrote a visit review for this place</p>
		{:else}
			<Modal id="experienceReview" buttonText="write a review">
				<ExperienceReviewForm
					placeId={data.place.id}
					successfullyPosted={form?.postExperienceReviewSuccess}
				/>
			</Modal>
		{/if}
	{/if}
</div>
