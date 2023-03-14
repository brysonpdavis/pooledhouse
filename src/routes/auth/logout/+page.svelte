<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
</script>

<p>are you sure you want to log out?</p>

<button class="btn-primary btn" on:click={() => signOut()}>logout</button>
