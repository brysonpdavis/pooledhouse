<script lang="ts">
	import { inject } from '@vercel/analytics'
	import NavWrapper from '$lib/components/NavWrapper.svelte'
	import Loading from '$lib/components/Loading.svelte'
	import type { LayoutProps } from './$types'
	import { navigating } from '$app/state'
	import { dev } from '$app/environment'
	import '../app.css'

	inject({ mode: dev ? 'development' : 'production' })

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>pooledhouse</title>
</svelte:head>

<div class="flex min-h-[100dvh] flex-col justify-between">
	<NavWrapper loggedIn={data.session !== null}>
		<main class="flex w-full grow">
			<div class="dynamic-layout p-4">
				<content class="prose w-full">
					{#if !!navigating.to}
						<Loading />
					{:else}
						{@render children?.()}
					{/if}
				</content>
			</div>
		</main>
	</NavWrapper>
</div>
