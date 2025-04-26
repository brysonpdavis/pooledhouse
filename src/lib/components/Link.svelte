<script lang="ts">
	interface Props {
		type?: 'primary' | 'secondary';
		href?: string;
		children?: import('svelte').Snippet;
	}

	let { type = 'primary', href = '', children }: Props = $props();
</script>

<a class={`hover:btn-${type}-focus btn-${type} btn`} {href}>
	{@render children?.()}
</a>
