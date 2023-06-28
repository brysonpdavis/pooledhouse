<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if data.userVerified}
	<!-- verified -->
	verified
{:else if !!data.session?.user?.email}
	<!-- logged in -->
	logged in
{:else}
	<!-- not logged in -->
	not logged in
{/if}
