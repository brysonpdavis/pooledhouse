<script lang="ts">
	import 'iconify-icon';
	import { signOut } from '@auth/sveltekit/client';
	// import { navigating } from '$app/stores';
	// import { onMount } from 'svelte';
	// import { browser } from '$app/environment';

	export let loggedIn: boolean;

	// let navDrawer: HTMLInputElement;

	// onMount(() => {
	// 	navDrawer = document.getElementById('nav-drawer') as HTMLInputElement;
	// });

	// $: closeNav = !!$navigating;

	// $: {
	// 	if (browser) {
	// 		navDrawer.setAttribute('checked', closeNav ? 'checked' : '');
	// 	}
	// }
</script>

<!-- <header class="flex h-12 w-full bg-base-200 md:h-16"> -->
<div class="drawer drawer-end">
	<input id="nav-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="navbar w-full bg-base-300">
			<div class="dynamic-layout items-center justify-between">
				<div class="mx-2 flex-1 px-2">
					<a href="/" class="flex font-mono text-xl font-bold text-accent hover:text-accent"
						>pooled<span class="text-secondary">house</span></a
					>
				</div>
				<div class="flex-none lg:hidden">
					<label for="nav-drawer" class="btn-ghost btn-square btn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block h-6 w-6 stroke-current"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/></svg
						>
					</label>
				</div>
				<div class="hidden flex-none lg:block">
					<ul class="menu menu-horizontal">
						<!-- Navbar menu content here -->
						<li><a href="/explore">explore</a></li>
						<li><a href="/about">about</a></li>
						{#if loggedIn}
							<li><a href="/profile">profile</a></li>
							<li><a href="/verify">verify</a></li>
							<li><button on:click={() => signOut()}>logout</button></li>
						{:else}
							<li><a href="/auth/login">login</a></li>
							<li><a href="/auth/register">sign up</a></li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
		<!-- Page content here -->
		<slot />
	</div>
	<div class="nav-drawer drawer-side">
		<label for="nav-drawer" class="drawer-overlay" />
		<ul class="menu h-full w-80 bg-base-200 p-4">
			<!-- Sidebar content here -->
			<li><a href="/explore">explore</a></li>
			<li><a href="/about">about</a></li>
			{#if loggedIn}
				<li><a href="/profile">profile</a></li>
				<li><a href="/verify">verify</a></li>
				<li><button on:click={() => signOut()}>logout</button></li>
			{:else}
				<li><a href="/auth/login">login</a></li>
				<li><a href="/auth/register">sign up</a></li>
			{/if}
		</ul>
	</div>
</div>
<!-- </header> -->
