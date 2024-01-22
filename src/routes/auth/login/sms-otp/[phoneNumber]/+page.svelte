<script lang="ts">
	import type { PageData } from './$types';

    export let data: PageData

    let code = ''
</script>

<h3>
    you should have received a code sent to {data.phone}
</h3>

<form method='post' action='login'>
    <input hidden name="phoneNumber" value={data.phone} />
    <input name="code" class="input input-bordered" bind:value={code} required />
    <button class="btn btn-primary" type="submit">submit</button>
</form>