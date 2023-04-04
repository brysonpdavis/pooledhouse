<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(JSON.stringify(data.user));
</script>

<h1>welcome to the other side</h1>

<h3>you're now logged in</h3>

<p>we're just going to call this the profile page for now</p>

<h4 class="font-mono">user data:</h4>

<pre>
    {JSON.stringify(data.user, undefined, 4)}
</pre>
