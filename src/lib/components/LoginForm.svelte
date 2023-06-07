<script lang="ts">
	import { enhance } from '$app/forms';
import { goto } from '$app/navigation';
	import { signIn } from '@auth/sveltekit/client';

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

<div class="w-fit m-auto">
	<h2>would you like to login by email or phone number?</h2>

	<form
		on:submit={async (event) => {
			submitting = true
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
		<button type="submit" class={`btn-outline btn-secondary btn mt-4 w-full ${submitting ? 'loading' : ''}` }>
			log in!
		</button>
	</form>
</div>