<script lang="ts">
	import { slide } from 'svelte/transition'
	export let form
	let countryCode = '+1'
	let hasVerificationCode: boolean = false
	let loading = false
</script>

<div class="m-auto w-fit h-full flex lg:justify-center flex-col gap-4">
	<h1 class="m-0 font-extralight uppercase tracking-wide text-accent">register</h1>
	<h2 class="m-0 font-light">let's get you in the system</h2>
	<form class="form-control max-w-xl gap-4" method="post" on:submit={() => (loading = true)}>
		<label class="input-group">
			<input
				required
				name="email"
				type="email"
				placeholder="you@example.com"
				class="input-bordered input w-full"
			/>
			<span class="w-20 flex-shrink-0">email</span>
		</label>
		<label class="input-group" for="phone">
			<input
				required
				readonly
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
			<span class="w-20 flex-shrink-0">phone</span>
		</label>
		<label class="label">
			<span class="label-text text-accent">have a verification code?</span>
			<input type="checkbox" class="toggle-accent toggle" bind:checked={hasVerificationCode} />
		</label>
		{#if hasVerificationCode}
			<label
				class="input-group"
				class:hidden={!hasVerificationCode}
				transition:slide={{ duration: 150 }}
			>
				<input
					name="code"
					type="text"
					placeholder="******"
					class="input-bordered input w-full"
					maxlength="6"
					minlength="6"
				/>
				<span class="w-20 flex-shrink-0">code</span>
			</label>
		{/if}
		<button type="submit" class="btn-secondary btn" class:loading disabled={loading}>
			submit
		</button>
		{#if form?.message}
			<div class="text-red-400">{form.message}</div>
		{/if}
	</form>
	<div class="max-w-xl">
		<p>
			don't worry, your reviews will always be anonymous, we only use your email and phone for
			logging you in and making sure that you're a real person.
		</p>
	</div>
</div>
