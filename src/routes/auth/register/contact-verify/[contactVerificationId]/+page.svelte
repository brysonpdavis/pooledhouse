<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	import 'iconify-icon';
	import { fly, slide } from 'svelte/transition';

	export let data: PageData;

	export let form: ActionData;
</script>

<h1>let's get your info verified</h1>

<h3>phone verification code for {data.phone}</h3>
{#if data.phoneVerified || form?.phoneSuccess}
	<iconify-icon class="md:text-2xl" icon="material-symbols:check-box" />
{:else}
	<form action="?/verifyPhone" method="post" use:enhance>
		<input class="input-bordered input" name="code" />
		<button class="btn-primary btn" type="submit">submit</button>
		<form action="?/resendPhone" method="post" class="btn-accent btn" use:enhance>
			<button type="submit">resend</button>
		</form>
	</form>
	{#if form?.phoneFailed}
		<div in:fly><span class="text-error"> oops, looks like that code didn't work </span></div>
	{:else if form?.phoneResent}
		<div class="text-success" in:fly>phone verification code resent</div>
	{/if}
{/if}

<h3>email verification code for {data.email}</h3>
{#if data.emailVerified || form?.emailSuccess}
	<iconify-icon class="md:text-2xl" icon="material-symbols:check-box" />
{:else}
	<form action="?/verifyEmail" method="post" use:enhance>
		<input class="input-bordered input" name="code" />
		<button class="btn-primary btn" type="submit">submit</button>
		<form action="?/resendEmail" method="post" class="btn-accent btn" use:enhance>
			<button type="submit">resend</button>
		</form>
	</form>
	{#if form?.emailFailed}
		<div class="text-error" in:fly>oops, looks like that code didn't work</div>
	{:else if form?.emailResent}
		<div class="text-success" in:fly>email verification code resent</div>
	{:else}
		<div in:fly>you may need to check your spam folder</div>
	{/if}
{/if}
