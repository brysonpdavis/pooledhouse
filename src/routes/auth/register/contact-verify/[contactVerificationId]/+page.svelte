<script lang="ts">
	import type { PageData, ActionData } from './$types';
    import {enhance} from '$app/forms'

	import 'iconify-icon';

	export let data: PageData;

	export let form: ActionData;
</script>

<h1>let's get your info verified</h1>

<h3>phone verification code for {data.phone}</h3>
{#if data.phoneVerified || form?.phoneSuccess}
	<iconify-icon class="md:text-2xl" icon="material-symbols:check-box" />
{:else}
	<form action="?/verifyPhone" method="post" use:enhance>
		<input class="input-accent input" name="code" />
		<button class="btn-primary btn" type="submit">submit</button>
		<form action="?/resendPhone" method="post" class="btn-accent btn" use:enhance>
			<button type="submit">resend</button>
		</form>
	</form>
	{#if form?.phoneFailed}
		<span class="text-red-600"> oops, looks like that code didn't work </span>
	{/if}
	{#if form?.phoneResent}
		phone verification code resent
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
		<span class="text-red-600"> oops, looks like that code didn't work </span>
	{/if}
	{#if form?.emailResent}
		email verification code resent
	{/if}
{/if}
