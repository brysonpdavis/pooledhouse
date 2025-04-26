<script lang="ts">
	import type { PageProps } from './$types'
	import ContributeLoggedInPage from './ContributeLoggedInPage.svelte'
	import ContributeLoggedOutPage from './ContributeLoggedOutPage.svelte'
	import ContributeVerifiedPage from './ContributeVerifiedPage.svelte'

	let { data }: PageProps = $props();
</script>

{#if data.userVerified}
	<!-- verified -->
	<ContributeVerifiedPage />
{:else if !!data.session?.user?.userId}
	<!-- logged in -->
	<ContributeLoggedInPage />
{:else}
	<!-- not logged in -->
	<ContributeLoggedOutPage />
{/if}
