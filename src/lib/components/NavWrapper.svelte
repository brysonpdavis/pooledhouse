<script lang="ts">
	import 'iconify-icon';

	export let loggedIn: boolean;

	let navOpen: boolean = false;

	const constantMenuOptions: { href: string; name: string }[] = [
		{ name: 'explore', href: '/explore' },
		{ name: 'about', href: '/about' }
	];

	const loggedInMenuOptions: { href: string; name: string }[] = [
		{ name: 'profile', href: '/profile' },
		{ name: 'verify', href: '/verify' },
		{ name: 'logout', href: '/auth/logout' }
	];

	const loggedOutMenuOptions: { href: string; name: string }[] = [
		{ name: 'login', href: '/auth/login' },
		{ name: 'sign up', href: '/auth/register' }
	];

	$: menuOptions = [
		...constantMenuOptions,
		...(loggedIn ? loggedInMenuOptions : loggedOutMenuOptions)
	];
</script>

<div class="drawer drawer-end">
	<input id="nav-drawer" type="checkbox" class="drawer-toggle" bind:checked={navOpen} />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="navbar w-full bg-base-300">
			<div class="dynamic-layout justify-between">
				<div class="flex-shrink">
					<a href="/" class="flex font-mono text-xl font-bold text-accent hover:text-accent"
						>pooled<span class="text-white">house</span></a
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
						{#each menuOptions as { href, name }}
							<li><a {href}>{name}</a></li>
						{/each}
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
			{#each menuOptions as { href, name }}
				<li><a on:click={() => (navOpen = false)} {href}>{name}</a></li>
			{/each}
		</ul>
	</div>
</div>
