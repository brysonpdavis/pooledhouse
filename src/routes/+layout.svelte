<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="flex min-h-screen flex-col justify-between">
	<Header />
	<main class="mb-auto flex h-fit w-full items-center">
		<div class="dynamic-layout p-4">
			<content class="prose">
				<slot />
			</content>
		</div>
	</main>
	<Footer />
</div>
