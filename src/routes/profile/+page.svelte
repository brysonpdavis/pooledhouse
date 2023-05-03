<script lang="ts">
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showControls = false;
	let showUserData = false;

	const numWorkplaceReviewsWritten = data.user.workplaceReviewTokens.filter(
		(wrt) => !!wrt.workplaceReview
	).length;
</script>

<h1>welcome to the other side</h1>

{#if $page.url.searchParams.get('fromLogin') !== null}
	<h3>you're now logged in</h3>
{/if}

<div class="flex flex-col gap-4">
	<div>
		verification status:
		{#if data.user.verification}
			<div class="badge-secondary badge badge-lg">verified</div>
		{:else}
			<div class="badge-primary badge-outline badge badge-lg">unverified</div>
		{/if}
	</div>
	<div>
		workplace reviews written: {numWorkplaceReviewsWritten}
	</div>
	<div>
		available workplace review credits: {data.user.workplaceReviewTokens.length -
			numWorkplaceReviewsWritten}
	</div>

	<!-- everything after this comment will be gone in production -->

	<label class="label w-fit gap-4">
		<span class="label-text text-accent">controls</span>
		<input type="checkbox" class="toggle-accent toggle" bind:checked={showControls} />
	</label>

	{#if showControls}
		<div transition:slide|local={{ duration: 150 }}>
			<button
				class="btn-outline btn-accent btn"
				on:click={async () => {
					const response = await fetch('/api/places/randomize', { method: 'POST' });
					console.log(await response.json());
				}}
			>
				randomize scores
			</button>

			<button
				class="btn-outline btn-secondary btn"
				on:click={async () => {
					const response = await fetch('/api/places/clear', { method: 'POST' });
					console.log(await response.json());
				}}
			>
				clear scores
			</button>

			<form method="post" action="?/addWorkplaceReviewToken">
				<button class="btn-outline btn-accent btn" type="submit"
					>create workplace review token</button
				>
			</form>
			{#if form?.createdWorkplaceReviewToken}
				<div class="text-neutral">new token created: {form.createdWorkplaceReviewToken}</div>
			{/if}
		</div>
	{/if}

	<label class="label w-fit gap-4">
		<span class="label-text text-accent">user data</span>
		<input type="checkbox" class="toggle-accent toggle" bind:checked={showUserData} />
	</label>

	{#if showUserData}
		<pre transition:slide|local={{ duration: 500 }}>
		{JSON.stringify(data.user, undefined, 4)}
	</pre>
	{/if}
</div>
