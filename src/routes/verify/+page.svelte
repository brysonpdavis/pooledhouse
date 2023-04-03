<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { copy } from 'svelte-copy';
	import 'iconify-icon';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	let tokens = data.createdTokens;

	$: if (form?.newToken) {
		tokens = [...tokens, form.newToken];
	}

	let loading = false;
</script>

{#if data.userVerified}
	<h3>looks like you're verified</h3>
	<p>
		here you can generate some verification codes. send them to your industry friends to get them
		verified too!
	</p>
	<div class="m-auto flex w-full max-w-md flex-col gap-4 lg:grid lg:max-w-full lg:grid-cols-2 justify-items-center">
		{#each tokens as token}
			<div class="card-bordered card p-4 shadow-md w-full max-w-md">
				<div class="flex flex-row items-center gap-12">
					{#if token.consumed}
						<iconify-icon class="text-2xl" icon="material-symbols:check-box-outline" />
					{:else}
						<iconify-icon class="text-2xl" icon="material-symbols:check-box-outline-blank" />
					{/if}
					<div class="justify-characters flex-grow font-mono text-2xl">
						{token.token}
					</div>
					<button class="btn-neutral btn" use:copy={token.token}>
						<iconify-icon class="text-lg" icon="material-symbols:content-copy-outline" />
					</button>
				</div>
			</div>
		{/each}
		{#if loading}
			<div class="card-bordered card p-4 shadow-md">
				<div class="flex h-full animate-pulse flex-row items-center justify-center space-x-5">
					<iconify-icon class="text-2xl" icon="material-symbols:check-box-outline-blank" />
					<div class="h-6 w-36 flex-grow rounded-md bg-gray-300" />
					<button class="btn-neutral btn">
						<iconify-icon class="text-lg" icon="material-symbols:content-copy-outline" />
					</button>
				</div>
			</div>
		{/if}
	</div>
	<div>
		<form
			class="my-4 w-full"
			method="post"
			action="?/createToken"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<button class="btn-primary btn w-full" class:loading type="submit">
				generate new verification code
			</button>
		</form>
	</div>
{:else}
	<h3>looks like you need to get verified</h3>
	<p>
		in order to post information and reviews on pooledhouse, you have to be verified as a restaurant
		worker. if you don't work in the service industry, you're free to explore all the information
		available on the app, but we want information here to specifically represent the perspective of
		those in the industry.
	</p>

	<p>
		all you need to get verified is a verification code from someone who has already been verified,
		and you can input that code right here on this page. whoever told you about the app will
		probably be your best resource!
	</p>

	<form class="form-control" method="post" action="?/verifyMe">
		<div class="flex w-fit flex-row gap-4">
			<label class="input-group">
				<input
					class="input-bordered input"
					name="verificationToken"
					required
					minlength="6"
					maxlength="8"
				/>
				<span>verification code</span>
			</label>
			<button class="btn-primary btn" type="submit">submit</button>
		</div>
	</form>
	{#if form?.invalidToken}
		<div>invalid token</div>
	{:else if form?.unavailableToken}
		<div>that token isn't available</div>
	{/if}

	<p>
		if you're a restaurant worker and can't find anyone to verify you, feel free to email me at
		hey@brysondavis.dev, and i'll make sure you get verified!
	</p>
{/if}

<style>
	.justify-characters {
		text-justify: inter-character;
		text-align-last: justify;
	}
</style>
