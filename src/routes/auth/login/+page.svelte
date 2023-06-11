<script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn } from '@auth/sveltekit/client';
	import Link from '$lib/components/Link.svelte';
	import { page } from '$app/stores';

	let identifier = '';
	let loginMethod: 'email' | 'phone' = 'email';
	let submitting = false;

	async function handleSubmit() {
		if (loginMethod === 'email') {
			await signIn('email', { email: identifier });
		} else {
			await goto(`/auth/login/sms-otp/${identifier}`, { replaceState: true });
		}
	}
</script>

<div class="m-auto flex h-full w-fit flex-col gap-4 lg:justify-center">
	{#if $page.url.searchParams.get('redirectFrom') === 'nope'}
		<h1>oops! you can't go there!</h1>
	{/if}
	<h1 class="m-0 font-extralight uppercase tracking-wide text-accent">login</h1>
	<h2 class="m-0 font-light">no passwords, we'll send you a link or a code</h2>

	<form
		on:submit={async (event) => {
			submitting = true;
			event.preventDefault();
			await handleSubmit();
		}}
		class="flex flex-col"
	>
		<!-- svelte-ignore a11y-autofocus -->
		<div class="input-group">
			{#if loginMethod === 'email'}
				<input
					required
					autofocus
					type="email"
					name="email"
					placeholder="email"
					bind:value={identifier}
					class="input-bordered input-primary input w-full max-w-lg"
				/>
			{:else}
				<input
					disabled
					required
					autofocus
					type="tel"
					name="phone"
					placeholder="phone login is currently a work in progress"
					bind:value={identifier}
					class="input-bordered input-primary input w-full max-w-lg"
				/>
			{/if}
			<select bind:value={loginMethod} class="select-bordered select">
				<option value="email">email</option>
				<option value="phone">phone</option>
			</select>
		</div>
		<button
			type="submit"
			class={`btn-outline btn-secondary btn mt-4 w-full ${submitting ? 'loading' : ''}`}
		>
			let's go
		</button>

		<!-- horizontal divider with text in center -->
		<div class="flex items-center py-2">
			<hr class="m-0 w-full border-primary" />
			<span class="px-4">or</span>
			<hr class="m-0 w-full border-primary" />
		</div>

		<Link href="/auth/register">register</Link>
	</form>
</div>
