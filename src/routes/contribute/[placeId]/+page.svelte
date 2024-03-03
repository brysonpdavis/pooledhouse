<script lang="ts">
	import type { ActionData, PageData } from './$types'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import Modal from '$lib/components/Modal.svelte'
	import WorkplaceReviewForm from './WorkplaceReviewForm.svelte'
	import ExperienceReviewForm from './ExperienceReviewForm.svelte'

	export let data: PageData
	export let form: ActionData

	const workplaceReviewToken = data.reviewToken
</script>

{#if data.userVerified}
	<!-- verified -->
	{#if data.previousWorkplaceReview}
		<p class="text-accent">you already wrote a workplace review for this place</p>
		<form method="post" action="?/deleteReview" use:enhance>
			<input name="reviewId" class="hidden" value={data.previousWorkplaceReview.id} />
			<button class="btn-outline btn-secondary btn" type="submit">delete your review</button>
		</form>
	{:else if workplaceReviewToken}
		<h3>have you worked at this establishment?</h3>
		<WorkplaceReviewForm
			zodErrors={form?.workplaceReviewSchemaErrors}
			placeId={$page.params.placeId}
			successfullyPosted={form?.postWorkplaceReviewSuccess}
			{workplaceReviewToken}
		/>
	{:else}
		<p>you're out of workplace reviews :(</p>
	{/if}
{:else if !!data.session?.user?.userId}
	<!-- logged in, not verified -->
{:else}
	<!-- not logged in -->
{/if}

{#if data.previousExperienceReview}
	<p>you already wrote a visit review for this place</p>
{:else}
	<Modal id="experienceReview" buttonText="write a review">
		<ExperienceReviewForm
			placeId={$page.params.placeId}
			successfullyPosted={form?.postExperienceReviewSuccess}
		/>
	</Modal>
{/if}
