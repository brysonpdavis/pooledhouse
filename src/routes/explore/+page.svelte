<script lang="ts">
	import ExploreMap from './ExploreMap.svelte'
	import type { PageProps } from './$types'
	import { browser } from '$app/environment'

	let { data }: PageProps = $props()
</script>

<div class="h-full w-full">
	{#if browser}
		<ExploreMap places={data.places} />
	{/if}
</div>
