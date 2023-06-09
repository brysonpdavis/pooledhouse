<script lang="ts">
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { ReviewComment, ReviewCommentReaction } from '@prisma/client';
	import {page} from '$app/stores'

	export let comment: ReviewComment;

	let showReactions = false;
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
	class="card flex w-fit flex-col bg-base-200 p-4 shadow-slate-500 hover:shadow-sm"
	on:mouseenter={() => {
		showReactions = true;
	}}
	on:touchstart={() => {
		showReactions = !showReactions
	}}
	on:mouseleave={() => {
		showReactions = false;
	}}
>
	<div>{comment.text}</div>
	{#if comment.numberOfReactions > 0}
		<div>{comment.numberOfAgreements} / {comment.numberOfReactions} agree</div>
	{/if}
	{#if showReactions && $page.data.session?.user}
		<div class="flex w-full flex-row justify-start gap-2" transition:slide={{ duration: 200 }}>
			<form
				method="post"
				action="?/commentReaction"
				use:enhance={() => {
					reactionLoading = true;
					return async ({ update }) => {
						await update();
						reactionState = "agree"
						reactionLoading = false;
					};
				}}
			>
				<input name="commentId" class="hidden" value={comment.id} />
				<input name="agree" class="hidden" value="agree" />
				<button
					type="submit"
					disabled={reactionLoading}
					class="rounded-md p-2 hover:bg-primary"
					class:bg-primary={reactionState === 'agree'}>&#128077;</button
				>
			</form>
			<form
				method="post"
				action="?/commentReaction"
				use:enhance={() => {
					reactionLoading = true;
					return async ({ update }) => {
						await update();
						reactionState = "disagree"
						reactionLoading = false;
					};
				}}
			>
				<input name="commentId" class="hidden" value={comment.id} />
				<input name="agree" class="hidden" value="disagree" />
				<button
					type="submit"
					disabled={reactionLoading}
					class="rounded-md p-2 hover:bg-primary"
					class:bg-primary={reactionState === 'disagree'}>&#128078;</button
				>
			</form>
		</div>
	{/if}
</div>
