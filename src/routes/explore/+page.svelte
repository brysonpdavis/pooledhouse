<script lang="ts">
	import ExploreMap from './ExploreMap.svelte'
	import type { PageData } from './$types'
	import { browser } from '$app/environment'
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="h-full w-full">
	{#if browser}
		<ExploreMap places={data.places} />
	{/if}
</div>
