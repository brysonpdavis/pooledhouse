<script lang="ts">
	export let errors: { _errors?: string[] } | undefined
</script>

{#if errors && errors._errors && errors._errors.length}
	{#each errors._errors as err}
		<div class="text-sm text-error">{err}</div>
	{/each}
{/if}
