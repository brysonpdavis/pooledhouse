<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';

	let email = '';
	let errorMessage: undefined | string;

	const validateEmailAndLogin = async (s: string) => {
		if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(s)) {
			errorMessage = 'please enter a valid email';
			return;
		}

		signIn('email', { email: s });
	};
</script>

<h2>would you like to login?</h2>

<form on:submit={() => validateEmailAndLogin(email)}>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		required
		autofocus
		type="text"
		name="email"
		placeholder="email"
		bind:value={email}
		class="input-bordered input-primary input w-full"
	/>
	<button type="submit" class="hover:btn-primary-focus btn-primary btn mt-4 w-full">log in!</button>
	{#if errorMessage}
		<label class="label" for="email"><span class="label-text-alt">{errorMessage}</span></label>
	{/if}
</form>
