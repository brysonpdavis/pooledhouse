<script lang="ts">
	import ExploreMap from './ExploreMap.svelte';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	export let data: PageData;
</script>

<div class="h-full w-full">
	{#if browser}
		<ExploreMap places={data.places} />
	{/if}
</div>
