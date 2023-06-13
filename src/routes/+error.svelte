<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>error :(</title>
</svelte:head>

<div class="m-auto flex h-full w-fit flex-col justify-center">
	<div class="mb-8 w-full text-center text-7xl">{$page.status}</div>
	<h1 class="mb-0 w-full text-center font-thin uppercase text-secondary">
		uh oh, that's an error!
	</h1>
	<h2 class="mt-4 w-full text-center font-normal text-accent">{$page.error?.message}</h2>
</div>
