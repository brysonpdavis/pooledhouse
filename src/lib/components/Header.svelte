<script lang="ts">
	import 'iconify-icon';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
</script>

<header class="flex h-12 w-full bg-primary md:h-16">
	<div class="dynamic-layout items-center justify-between">
		<a href="/" class="flex font-mono font-bold text-neutral md:text-xl">pooledhouse</a>
		<div class="dropdown-end dropdown h-full">
			<button class="btn-primary btn aspect-square h-full text-accent">
				<iconify-icon class="md:text-2xl" icon="material-symbols:menu-rounded" />
			</button>
			<ul tabindex="-1" class="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow">
				<li><a href="/protected">protected</a></li>
				{#if $page.data.session}
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
