<script lang="ts">
	import { enhance } from '$app/forms'

	export let placeId: string
	export let successfullyPosted: boolean = false
</script>

{#if successfullyPosted}
	<div>review submitted</div>
{:else}
	<form action={`/contribute/${placeId}?/postExperienceReview`} method="post" use:enhance>
		<label for="general" class="label">
			tell us what everyone should know about working here
		</label>
		<textarea
			class="textarea-bordered textarea h-32 w-full max-w-lg"
			name="general"
			placeholder="well, you see..."
		/>
		<label for="rating" class="label">how much did you enjoy working here?</label>
		<div class="rating gap-1">
			<input value={0} type="radio" name="rating" class="mask mask-star-2 bg-red-400" />
			<input value={25} type="radio" name="rating" class="mask mask-star-2 bg-orange-400" />
			<input value={50} type="radio" name="rating" class="mask mask-star-2 bg-yellow-400" checked />
			<input value={75} type="radio" name="rating" class="mask mask-star-2 bg-lime-400" />
			<input value={100} type="radio" name="rating" class="mask mask-star-2 bg-green-400" />
		</div>
		<label for="general" class="label">how would you rate your compensation?</label>
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

		<div class="my-4">
			<button type="submit" class="btn-primary btn">submit</button>
		</div>
	</form>
{/if}
