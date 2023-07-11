<script lang="ts">
	import Comment from './Comment.svelte';
	import type { PageData } from './$types';
	import type { ReviewCommentReaction } from '@prisma/client';
	import { slide } from 'svelte/transition';
	import { scoreColorGradient } from '$lib/utils/colors';
	import {page} from '$app/stores'

	export let data: PageData;

	let showSection: 'workplace' | 'experience' = 'workplace';

	const usersCommentReactionsByCommentId = data.usersCommentReactions?.reduce(
		(map, cr) => map.set(cr.reviewCommentId, cr),
		new Map<string, ReviewCommentReaction>()
	);

	const workplaceSections: { key: keyof typeof data.comments.workplace; heading: string }[] = [
		{ key: 'general', heading: 'what everyone should know' },
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
				class="btn flex flex-1 tracking-wider rounded-full">workplace</button
			>
			<button
				on:click={() => (showSection = 'experience')}
				class:btn-active={showSection === 'experience'}
				class="btn flex flex-1 tracking-wider">visit</button
			>
		</div>
	</div>

	<div class="flex w-full flex-col gap-4">
		{#if showSection === 'workplace'}
			<div
				transition:slide={{ axis: 'y' }}
				class="flex flex-grow overflow-hidden p-4"
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
				transition:slide={{ axis: 'y' }}
				class="flex flex-grow overflow-hidden p-4"
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
		<h3>have you visited or worked for this establishment?</h3>

		<p>if you would like to contribute your own experience, we would love to hear about it</p>

		<a class="btn" href={`/contribute/${$page.params.placeId}`}>contribute</a>
	{/if}
</div>
