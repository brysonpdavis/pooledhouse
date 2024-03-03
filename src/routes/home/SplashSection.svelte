<script lang="ts">
	export let href: string
	export let titleText: string
	export let bodyText: string
	export let buttonText: string
</script>

<div class="card bg-base-200 p-4 lg:p-8 lg:w-1/3">
	<div class="flex flex-grow flex-col justify-between gap-4">
		<div class="flex-grow">
			<div class="text-2xl text-accent tracking-wider font-extrabold uppercase">{titleText}</div>
			<p>{bodyText}</p>
		</div>
		<a class="btn-secondary btn" {href}>{buttonText}</a>
	</div>
</div>
