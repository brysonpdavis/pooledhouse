<script lang="ts">
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { ReviewComment } from '@prisma/client';

	export let comment: ReviewComment;

	let showReactions = false;
	let reactionLoading = false;
</script>

<div
	class="card flex w-fit flex-col bg-base-200 p-4 shadow-slate-500 hover:shadow-sm"
	on:mouseenter={() => {
		showReactions = true;
	}}
	on:mouseleave={() => {
		showReactions = false;
	}}
>
	<div>{comment.text}</div>
	{#if comment.numberOfReactions > 0}
		<div>{comment.numberOfAgreements} / {comment.numberOfReactions} agree</div>
	{/if}
	{#if showReactions}
		<div class="flex w-full flex-row justify-between" transition:slide={{ duration: 200 }}>
			<form
				method="post"
				action="?/commentReaction"
				use:enhance={() => {
					reactionLoading = true;
					return () => (reactionLoading = false);
				}}
			>
				<input name="commentId" class="hidden" value={comment.id} />
				<input name="agree" class="hidden" value="agree" />
				<button type="submit" disabled={reactionLoading}>&#128077;</button>
			</form>
			<form
				method="post"
				action="?/commentReaction"
				use:enhance={() => {
					reactionLoading = true;
					return () => (reactionLoading = false);
				}}
			>
				<input name="commentId" class="hidden" value={comment.id} />
				<input name="agree" class="hidden" value="disagree" />
				<button type="submit" disabled={reactionLoading}>&#128078;</button>
			</form>
		</div>
	{/if}
</div>
