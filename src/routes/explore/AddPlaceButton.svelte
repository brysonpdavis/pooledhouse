<script lang="ts">
	interface Props {
		uploadInProgress?: boolean;
		handleClickAdd: () => void;
	}

	let { uploadInProgress = false, handleClickAdd }: Props = $props();
</script>

<div class="card-bordered card mx-4 h-fit w-[235px] bg-primary">
	<div class="m-2 flex flex-grow-0 flex-row text-secondary">
		<p class="my-0">that place isn't in the database yet, would you like to add it?</p>
	</div>
	<button
		class="loading btn-outline btn-accent btn"
		class:loading={uploadInProgress}
		onclick={() => handleClickAdd()}
	>
		{#if !uploadInProgress}add{/if}
	</button>
</div>
