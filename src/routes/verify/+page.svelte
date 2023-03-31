<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;

    const tokens = data.createdTokens
</script>

<div>
    <form method="post" action="?/createToken">
        <button class="btn btn-primary" type="submit">create a new token</button>
    </form>
</div>

<h3>
    these are your tokens you've already created
</h3>
<div>
    {#each tokens as token}
    <p>
        {token.token}
    </p>
    {/each}
</div>