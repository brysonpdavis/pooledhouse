<script lang="ts">
	export let data: PageData;
	import type { PageData } from './$types';
</script>

<div class="flex flex-col">
	<h1 class="flex">here are the users</h1>
	
	<pre>
		{JSON.stringify(data.users, undefined, 2)}
	</pre>

	{#if data.users.length === 0}
		<p>oops! no users</p>
	{:else}
		<ul>
			{#each data.users as user}
				{#each Object.entries(user) as [key, value]}
					<li>{key}: {value}</li>
				{/each}
			{/each}
		</ul>
	{/if}
</div>
