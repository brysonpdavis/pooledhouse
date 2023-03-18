<script lang="ts">
	import GoogleMap from '$lib/components/GoogleMap.svelte';
	let show: boolean = false;
</script>

<!-- <svelte:head>
    <script 
        defer 
        async 
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
    />
</svelte:head> -->

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
