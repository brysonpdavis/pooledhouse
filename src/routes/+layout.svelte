<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>
<svelte:head>
	<title>pooledhouse</title>
</svelte:head>

<div class="flex min-h-screen flex-col justify-between">
	<Header />
	<main class="flex w-full flex-grow">
		<div class="dynamic-layout p-4">
			<content class="prose w-full">
				<slot />
			</content>
		</div>
	</main>
	<Footer />
</div>
