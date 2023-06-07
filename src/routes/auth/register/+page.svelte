<script lang="ts">
	import { slide } from 'svelte/transition';

	let countryCode = '+1';
	let hasVerificationCode: boolean = false;
	let loading = false;
</script>
<div class="w-fit m-auto">
<h3 class="w-fit">To create an account, all you need is a phone number and an email.</h3>
<form
	class="form-control max-w-xl gap-4"
	method="post"
	action="?/register"
	on:submit={() => loading = true}
>
	<label class="input-group">
		<input
			required
			name="email"
			type="email"
			placeholder="you@example.com"
			class="input-bordered input w-full"
		/>
		<span class="text-secondary w-20 flex-shrink-0">email</span>
	</label>
	<label class="input-group" for="phone">
		<input
			required
			name="country-code"
			type="text"
			inputmode="numeric"
			pattern={'[+]{1}[0-9]{1,3}'}
			maxlength="4"
			bind:value={countryCode}
			class="input-bordered input w-20"
		/>
		<input
			required
			id="phone"
			name="phone"
			type="text"
			inputmode="numeric"
			maxlength="10"
			placeholder="3141592653"
			class="input-bordered input min-w-0 flex-grow"
		/>
		<span class="text-secondary w-20 flex-shrink-0">phone</span>
	</label>
	<label class="label">
		<span class="label-text text-accent">have a verification code?</span>
		<input type="checkbox" class="toggle-accent toggle" bind:checked={hasVerificationCode} />
	</label>
	{#if hasVerificationCode}
		<label
			class="input-group"
			class:hidden={!hasVerificationCode}
			transition:slide|local={{ duration: 150 }}
		>
			<input
				name="code"
				type="text"
				placeholder="******"
				class="input-bordered input w-full"
				maxlength="6"
				minlength="6"
			/>
			<span class="text-secondary w-20 flex-shrink-0">code</span>
		</label>
	{/if}
	<button type="submit" class="btn btn-outline btn-secondary" class:loading> submit </button>
</form>
<div class="max-w-xl">
	<p>
		Don't worry, your reviews will always be anonymous, we only use your email and phone for logging
		you in and making sure that you're a real person.
	</p>	
</div>
</div>