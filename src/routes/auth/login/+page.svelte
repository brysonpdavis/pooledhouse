<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let form;

	let identifier = '';
	let loginMethod: 'email' | 'phone' = 'email';
	let submitting = false;
</script>

<div class="m-auto flex h-full w-fit flex-col gap-4 lg:justify-center">
	{#if $page.url.searchParams.get('redirectFrom') === 'nope'}
		<h1>oops! you can't go there!</h1>
	{/if}
	<h1 class="m-0 font-extralight uppercase tracking-wide text-accent">login</h1>
	<h2 class="m-0 font-light">no passwords, we'll send you a link or a code</h2>

	<form
		action="?/login"
		method="post"
		use:enhance={() => {
			submitting = true;

			if (loginMethod === 'phone') {
				goto(`/auth/login/sms-otp/${identifier}`);
			}

			return ({result, update}) => {
				submitting = false;
				update({reset: false})
			}
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
		<button type="submit" class={`btn-secondary btn mt-4 w-full ${submitting ? 'loading' : ''}`}>
			let's go
		</button>
		{#if form?.message}
			<div class="text-red-400">{form.message}</div>
		{/if}
		<!-- horizontal divider with text in center -->
		<div class="flex items-center py-2">
			<hr class="m-0 w-full border-primary" />
			<span class="px-4">or</span>
			<hr class="m-0 w-full border-primary" />
		</div>

		<a href="/auth/register" class="btn-primary btn-outline btn w-full">register</a>
	</form>
</div>
