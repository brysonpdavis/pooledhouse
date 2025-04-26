<script lang="ts">
	import { enhance } from '$app/forms'
	import { slide } from 'svelte/transition'
	import FormError from '$lib/components/FormError.svelte'
	import type { ZodFormattedError } from 'zod'
	import type { postWorkplaceReviewFormDataSchema } from './post-workplace-review-form-zod-schema'

	interface Props {
		placeId: string;
		successfullyPosted?: boolean;
		workplaceReviewToken: string;
		zodErrors: 
		| ZodFormattedError<(typeof postWorkplaceReviewFormDataSchema)['_type']>
		| undefined;
	}

	let {
		placeId,
		successfullyPosted = false,
		workplaceReviewToken,
		zodErrors
	}: Props = $props();

	let showOptionalQuestions: boolean = $state(false)
</script>

{#if successfullyPosted}
	<div>review submitted</div>
{:else}
	<form action={`/contribute/${placeId}?/postWorkplaceReview`} method="post" use:enhance>
		<label for="general" class="label">
			tell us what everyone should know about working here
		</label>
		<textarea
			class="textarea-bordered textarea h-32 w-full max-w-lg"
			name="general"
			placeholder="well, you see..."
			maxlength={2000}
		></textarea>
		<FormError errors={zodErrors?.general} />
		<label for="rating" class="label">how much did you enjoy working here?</label>
		<div class="rating gap-1">
			<input value={0} type="radio" name="rating" class="mask mask-heart bg-red-400" />
			<input value={25} type="radio" name="rating" class="mask mask-heart bg-orange-400" />
			<input value={50} type="radio" name="rating" class="mask mask-heart bg-yellow-400" checked />
			<input value={75} type="radio" name="rating" class="mask mask-heart bg-lime-400" />
			<input value={100} type="radio" name="rating" class="mask mask-heart bg-green-400" />
		</div>
		<label for="compensation" class="label">how would you rate your compensation?</label>
		<div class="rating gap-1">
			<input value={0} type="radio" name="compensation" class="mask-dollar mask bg-green-300" />
			<input value={25} type="radio" name="compensation" class="mask-dollar mask bg-green-400" />
			<input
				value={50}
				type="radio"
				name="compensation"
				class="mask-dollar mask bg-green-500"
				checked
			/>
			<input value={75} type="radio" name="compensation" class="mask-dollar mask bg-green-600" />
			<input value={100} type="radio" name="compensation" class="mask-dollar mask bg-green-700" />
		</div>
		<label class="label">
			<span class="label-text text-accent"
				>have an extra second to answer a few more questions?</span
			>
			<input type="checkbox" class="toggle-accent toggle" bind:checked={showOptionalQuestions} />
		</label>

		{#if showOptionalQuestions}
			<label
				class:hidden={!showOptionalQuestions}
				transition:slide={{ duration: 1000 }}
				class="flex flex-col"
			>
				<label for="compensationDescription" class="label">
					any comments on your compensation?
				</label>
				<textarea
					class="textarea-bordered textarea h-16 w-full max-w-lg"
					id="compensationDescription"
					name="compensationDescription"
					placeholder="i mean, you know..."
					maxlength={1000}
				></textarea>
				<label for="guestDescription" class="label">
					how would you describe the general clientele?
				</label>
				<textarea
					class="textarea-bordered textarea h-16 w-full max-w-lg"
					id="guestDescription"
					name="guestDescription"
					placeholder="funny you should ask..."
					maxlength={1000}
				></textarea>
				<label for="cultureDescription" class="label">
					tell us a little about the work culture here
				</label>
				<textarea
					class="textarea-bordered textarea h-16 w-full max-w-lg"
					id="cultureDescription"
					name="cultureDescription"
					placeholder="it's kind of interesting..."
					maxlength={1000}
				></textarea>
				<label for="idealFor" class="label">who would this workplace be ideal for?</label>
				<textarea
					class="textarea-bordered textarea h-16 w-full max-w-lg"
					id="idealFor"
					name="idealFor"
					placeholder="hmm..."
					maxlength={1000}
				></textarea>
			</label>
		{/if}

		<input class="hidden" name="workplaceReviewToken" value={workplaceReviewToken} type="text" />

		<div class="my-4">
			<button type="submit" class="btn-primary btn">submit</button>
		</div>
	</form>
{/if}
