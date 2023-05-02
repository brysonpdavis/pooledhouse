<script lang="ts">
	export let id: string;
	export let buttonText: string;

	let show: boolean = false;
</script>

<!-- The button to open modal -->
<label for={`modal-${id}`} class="btn-primary btn">{buttonText}</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id={`modal-${id}`} class="modal-toggle" bind:checked={show} />

{#key show}
	<label for={`modal-${id}`} class="modal cursor-pointer">
		<label class="modal-box relative" for="">
			<label for={`modal-${id}`} class="btn-sm btn-circle btn absolute right-2 top-2">✕</label>
			<slot />
		</label>
	</label>
{/key}
