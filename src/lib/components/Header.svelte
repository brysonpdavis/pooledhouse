<script lang="ts">
	import 'iconify-icon';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
</script>

<header class="flex h-12 w-full bg-primary md:h-16">
	<div class="dynamic-layout items-center justify-between">
		<a href="/" class="flex font-mono text-xl font-bold text-primary-content"
			>pooled<span class="text-secondary">house</span></a
		>
		<div class="dropdown-end dropdown h-full">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn-ghost btn-square btn h-full text-primary-content">
				<iconify-icon class="text-2xl" icon="material-symbols:menu-rounded" />
			</label>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul
				tabindex="0"
				class="card-bordered dropdown-content menu rounded-box w-52 border-accent bg-base-100 p-2 shadow"
			>
				<li><a href="/about">about</a></li>
				{#if $page.data.session}
					<li><a href="/protected">profile</a></li>
					<li><a href="/verify">verify</a></li>
					<li><button on:click={() => signOut()}>logout</button></li>
				{:else}
					<li><a href="/auth/login">login</a></li>
					<li><a href="/auth/register">sign up</a></li>
				{/if}
			</ul>
		</div>
	</div>
</header>
