<script lang="ts">
	import GoogleMap from '$lib/components/GoogleMap.svelte';
	import type { PageData } from './$types';
	export let data: PageData
</script>

<div class="h-96 w-full">
	<GoogleMap places={data.places} />
</div>
