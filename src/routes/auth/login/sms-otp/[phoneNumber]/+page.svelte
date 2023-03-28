<script lang="ts">
    import {signIn} from '@auth/sveltekit/client'
	import type { PageData } from './$types';

    export let data: PageData

    let code = ''

    const handleSubmit = async () => {
        await signIn("phoneNumber", {
            phoneNumber: data.phone,
            otp: code
        })
    }
</script>

<h3>
    you should have received a code sent to {data.phone}
</h3>

<form on:submit={handleSubmit}>
    <input name="code" class="input input-bordered" bind:value={code} required />
    <button class="btn btn-primary" type="submit">submit</button>
</form>