<script lang="ts">
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<h1>welcome to the other side</h1>

<h3>you're now logged in</h3>

<p>we're just going to call this the profile page for now</p>

<form method="post" action="?/addWorkplaceReviewToken">
	<button class="btn btn-outline btn-accent" type="submit">create token</button>
</form>
{#if form?.createdWorkplaceReviewToken}
	<div class="text-neutral">new token created: {form.createdWorkplaceReviewToken}</div>
{/if}

<h4 class="font-mono">user data:</h4>

<pre>
    {JSON.stringify(data.user, undefined, 4)}
</pre>
