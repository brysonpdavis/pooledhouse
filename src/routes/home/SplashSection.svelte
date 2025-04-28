<script lang="ts">
	interface Props {
		href: string;
		titleText: string;
		bodyText: string;
		buttonText: string;
	}

	let {
		href,
		titleText,
		bodyText,
		buttonText
	}: Props = $props();
</script>

<div class="card bg-base-200 p-4 lg:p-8 lg:w-1/3">
	<div class="flex grow flex-col justify-between gap-4">
		<div class="grow">
			<div class="text-2xl text-accent tracking-wider font-extrabold uppercase">{titleText}</div>
			<p class="text-base-content my-4 leading-relaxed">{bodyText}</p>
		</div>
		<a class="btn-secondary btn" {href}>{buttonText}</a>
	</div>
</div>
