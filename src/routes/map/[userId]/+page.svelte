<script lang="ts">
	export let data: PageData;
	import type { PageData } from './$types';
</script>

<div class="flex flex-col">
	<h1 class="flex">here are the users</h1>
	
	<p>
		{JSON.stringify(data)}
	</p>

	{#if data.users.length === 0}
		<p>oops! no users</p>
	{:else}
		<ul>
			{#each data.users as user}
				{#each Object.entries(user) as field}
					<li>{field}</li>
				{/each}
			{/each}
		</ul>
	{/if}
</div>
