<script lang="ts">
	import Link from '$lib/components/Link.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="card bg-base-200 p-8 flex flex-col justify-center gap-4">
		<h1 class="font-medium m-0">oh no! looks like something went wrong</h1>
		{#if data.error === 'AccessDenied'}
			<h2 class="w-fit m-0 font-light">you might not have an account set up yet</h2>
			<Link type="secondary" href="/auth/register">register</Link>
		{/if}
	</div>
</div>
