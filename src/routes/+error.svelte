<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>error :(</title>
</svelte:head>

<h1>uh oh, that's an error!</h1>

<h2>{$page.status}: {$page.error?.message}</h2>
