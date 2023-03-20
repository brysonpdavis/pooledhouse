<script lang="ts">
	import GoogleMap from '$lib/components/GoogleMap.svelte';
	let show: boolean = false;
</script>

<div class="h-96 w-full">
	<h1>it's the map page!</h1>
	<button
		class="btn-primary btn"
		on:click={() => {
			show = !show;
		}}
	>
		{#if show}
			hide
		{:else}
			show
		{/if}
		map
	</button>
	{#if show}<GoogleMap />{/if}
</div>
