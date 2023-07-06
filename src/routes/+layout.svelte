<script lang="ts">
	import { inject } from '@vercel/analytics';
	import NavWrapper from '$lib/components/NavWrapper.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import type { PageData } from './$types';
	import { navigating } from '$app/stores';
	import { dev } from '$app/environment';
	import '../app.css';

	inject({ mode: dev ? 'development' : 'production' });

	export let data: PageData;
</script>

<svelte:head>
	<title>pooledhouse</title>
</svelte:head>

<div class="flex min-h-[100dvh] flex-col justify-between">
	<NavWrapper loggedIn={data.session !== null}>
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
	</NavWrapper>
</div>
