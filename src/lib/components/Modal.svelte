<script lang="ts">
	interface Props {
		id: string;
		buttonText: string;
		children?: import('svelte').Snippet;
	}

	let { id, buttonText, children }: Props = $props();

	let show: boolean = $state(false)
</script>

<!-- The button to open modal -->
<label for={`modal-${id}`} class="btn-primary btn">{buttonText}</label>

<input type="checkbox" id={`modal-${id}`} class="modal-toggle" bind:checked={show} />

{#key show}
	<label for={`modal-${id}`} class="modal cursor-pointer">
		<label class="modal-box relative" for="">
			<label for={`modal-${id}`} class="btn-sm btn-circle btn absolute right-2 top-2">✕</label>
			{@render children?.()}
		</label>
	</label>
{/key}
