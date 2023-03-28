<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<a href={`/explore/places/${data.place.id}`}>
	<h1>
		{data.place.name}
	</h1>
</a>

<h3 class="text-accent">
	{data.place.address}
</h3>

{#if form?.postReviewSuccess}
	<div>review submitted</div>
{:else}
	<form action="?/postReview" method="post" use:enhance>
		<label for="general" class="label">
			tell us whatever you want us to know about working there?
		</label>
		<textarea
			class="textarea-bordered textarea h-32 w-full max-w-lg"
			name="general"
			placeholder="well, you see..."
		/>
		<label for="rating" class="label">how much did you enjoy working there?</label>
		<div class="rating gap-1">
			<input value={0} type="radio" name="rating" class="mask mask-heart bg-red-400" />
			<input value={25} type="radio" name="rating" class="mask mask-heart bg-orange-400" />
			<input value={50} type="radio" name="rating" class="mask mask-heart bg-yellow-400" checked />
			<input value={75} type="radio" name="rating" class="mask mask-heart bg-lime-400" />
			<input value={100} type="radio" name="rating" class="mask mask-heart bg-green-400" />
		</div>
		<label for="general" class="label">how would you rate your compensation?</label>
		<div class="rating gap-1">
			<input value={0} type="radio" name="compensation" class="mask mask-diamond bg-green-300" />
			<input value={25} type="radio" name="compensation" class="mask mask-diamond bg-green-400" />
			<input
				value={50}
				type="radio"
				name="compensation"
				class="mask mask-diamond bg-green-500"
				checked
			/>
			<input value={75} type="radio" name="compensation" class="mask mask-diamond bg-green-600" />
			<input value={100} type="radio" name="compensation" class="mask mask-diamond bg-green-700" />
		</div>

		<div class="my-4">
			<button type="submit" class="btn-primary btn">submit</button>
		</div>
	</form>
{/if}
