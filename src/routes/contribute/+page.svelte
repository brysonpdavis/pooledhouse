<script lang="ts">
	import type { PageData } from './$types';
	import ContributeLoggedInPage from './ContributeLoggedInPage.svelte';
	import ContributeLoggedOutPage from './ContributeLoggedOutPage.svelte';
	import ContributeVerifiedPage from './ContributeVerifiedPage.svelte';

	export let data: PageData;
</script>

{#if data.userVerified}
	<!-- verified -->
	<ContributeVerifiedPage />
{:else if !!data.session?.user?.email}
	<!-- logged in -->
	<ContributeLoggedInPage />
{:else}
	<!-- not logged in -->
	<ContributeLoggedOutPage />
{/if}
