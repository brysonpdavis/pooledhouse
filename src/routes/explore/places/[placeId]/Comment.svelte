<script lang="ts">
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { ReviewComment, ReviewCommentReaction } from '@prisma/client';
	import { page } from '$app/stores';

	export let comment: ReviewComment;

	let focused = false;
	let reactionLoading = false;

	export let usersCommentReaction: ReviewCommentReaction | undefined = undefined;

	let reactionState: 'agree' | 'disagree' | undefined =
		usersCommentReaction?.agree === true
			? 'agree'
			: usersCommentReaction?.agree === false
			? 'disagree'
			: undefined;
</script>

<div
	class="card flex w-full flex-col gap-2 bg-base-200 p-4 hover:outline outline-primary"
	on:mouseenter={() => {
		focused = true;
	}}
	on:touchstart={() => {
		focused = !focused;
	}}
	on:mouseleave={() => {
		focused = false;
	}}
>
	<div>{comment.text}</div>
		<div in:slide={{ duration: 200 }} class="flex w-full flex-row justify-between items-end">
			<!-- TODO: make this conditional upon a user being verified, not just logged in -->
			{#if $page.data.session?.user}
			<div class="flex w-fit flex-row gap-2 card bg-black p-2">
				<form
					method="post"
					action="?/commentReaction"
					use:enhance={() => {
						reactionLoading = true;
						reactionState = 'agree';
						return async ({ update }) => {
							await update();
							reactionLoading = false;
						};
					}}
				>
					<input name="commentId" class="hidden" value={comment.id} />
					<input name="agree" class="hidden" value="agree" />
					<button
						type="submit"
						disabled={reactionLoading}
						class="rounded-md p-1 hover:bg-primary"
						class:bg-primary={reactionState === 'agree'}>&#128077;</button
					>
				</form>
				<form
					method="post"
					action="?/commentReaction"
					use:enhance={() => {
						reactionLoading = true;
						reactionState = 'disagree';
						return async ({ update }) => {
							await update();
							reactionLoading = false;
						};
					}}
				>
					<input name="commentId" class="hidden" value={comment.id} />
					<input name="agree" class="hidden" value="disagree" />
					<button
						type="submit"
						disabled={reactionLoading}
						class="rounded-md p-1 hover:bg-primary"
						class:bg-primary={reactionState === 'disagree'}>&#128078;</button
					>
				</form>
			</div>
			{/if}
			{#if comment.numberOfReactions > 0}
			<div class="card bg-black p-2">{comment.numberOfAgreements} / {comment.numberOfReactions} agree</div>
		{/if}

		</div>
</div>
