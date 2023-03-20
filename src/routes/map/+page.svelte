<script lang="ts">
	import GoogleMap from '$lib/components/GoogleMap.svelte';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	export let data: PageData;
</script>

<div class="h-96 w-full">
	{#if browser}
		<GoogleMap places={data.places} />
	{/if}
</div>
