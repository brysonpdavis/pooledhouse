<script lang="ts">
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<h1>welcome to the other side</h1>

<h3>you're now logged in</h3>

<button
	class="btn-outline btn-accent btn"
	on:click={async () => {
		const response = await fetch('/api/places/randomize', { method: 'POST' });
		console.log(await response.json());
	}}
>
	randomize
</button>

<button
	class="btn-outline btn-secondary btn"
	on:click={async () => {
		const response = await fetch('/api/places/clear', { method: 'POST' });
		console.log(await response.json());
	}}
>
	clear
</button>

<form method="post" action="?/addWorkplaceReviewToken">
	<button class="btn-outline btn-accent btn" type="submit">create token</button>
</form>
{#if form?.createdWorkplaceReviewToken}
	<div class="text-neutral">new token created: {form.createdWorkplaceReviewToken}</div>
{/if}

<h4 class="font-mono">user data:</h4>

<pre>
    {JSON.stringify(data.user, undefined, 4)}
</pre>

