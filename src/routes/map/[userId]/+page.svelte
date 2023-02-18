<script lang="ts">
	export let data: PageData;
	import type { PageData } from './$types';
</script>

<h1>
	{data}
</h1>

<ul>
	{#if data.users.length === 0}
		<p>oops! no users</p>
	{:else}
		{#each data.users as user}
			<li>{user}</li>
		{/each}
	{/if}
</ul>
