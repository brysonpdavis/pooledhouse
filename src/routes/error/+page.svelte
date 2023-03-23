<script lang="ts">
	import Link from '$lib/components/Link.svelte';
import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>oh no! looks like something went wrong. </h1>
{#if data.error === 'AccessDenied'}
    <h3>you might not have an account set up yet.</h3>
    <Link href="/auth/register">register here</Link>
{/if}
