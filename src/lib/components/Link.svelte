<script lang="ts">
	export let type: 'primary' | 'secondary' = 'primary'
	export let href: string = ''
</script>

<a class={`hover:btn-${type}-focus btn-${type} btn`} {href}>
	<slot />
</a>
