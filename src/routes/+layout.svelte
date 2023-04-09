<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import type { PageData } from './$types';
	import { navigating } from '$app/stores';

	export let data: PageData
</script>
<svelte:head>
	<title>pooledhouse</title>
</svelte:head>

<div class="flex min-h-screen flex-col justify-between">
	<Header loggedIn={data.session !== null} />
	<main class="flex w-full flex-grow">
		<div class="dynamic-layout p-4">
			<content class="prose w-full">
				{#if $navigating}
					<Loading />
				{:else}
					<slot />
				{/if}
			</content>
		</div>
	</main>
	<Footer />
</div>
