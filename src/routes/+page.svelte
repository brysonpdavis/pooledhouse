<script lang="ts">
	import mapExample from '$lib/assets/map-example.png';
</script>

<div class="flex flex-col items-center gap-8">
	<div class="flex flex-col items-center">
		<h1 class="mt-4 font-mono text-4xl font-light">
			pooled<span class="text-secondary">house</span>
		</h1>
		<h3 class="my-0 w-full text-center text-2xl font-normal md:text-4xl">
			a workplace transparency platform for restaurant workers in NYC
		</h3>
	</div>
	<div class="flex w-full flex-col gap-8 lg:flex-row">
		<div class="card bg-base-200 p-4 lg:w-1/3">
			<div class="flex flex-grow flex-col justify-between gap-4">
				<div class="flex-grow">
					<div class="text-2xl text-accent tracking-wide">looking for a new gig? just curious?</div>
					<p>
						see what other restaurant workers say about their workplace, or compare places in the
						city
					</p>
				</div>
				<a class="btn-outline btn-secondary btn" href="/explore">explore</a>
			</div>
		</div>
		<div class="card bg-base-200 p-4 lg:w-1/3">
			<div class="flex flex-grow flex-col justify-between gap-4">
				<div class="flex-grow">
					<div class="text-2xl text-accent tracking-wide">join the team!</div>
					<p>
						after registering as a verified restaurant worker, you can verify your friends or
						coworkers and join the conversation
					</p>
				</div>
				<a class="btn-outline btn-secondary btn" href="/auth/register">register</a>
			</div>
		</div>
		<div class="card bg-base-200 p-4 lg:w-1/3">
			<div class="flex flex-grow flex-col justify-between gap-4">
				<div class="flex-grow">
					<div class="text-2xl text-accent tracking-wide">share perspective on your own workplace</div>
					<p>
						let everyone know what it's really like behind the curtain at your place of work,
						anonymously
					</p>
				</div>
				<a class="btn-outline btn-secondary btn" href="/explore">contribute</a>
			</div>
		</div>
	</div>
	<div class="flex flex-col-reverse lg:flex-row lg:gap-8">
		<img
			class="card-bordered card m-0 w-full rounded-md border-8 border-base-200 lg:w-2/3"
			src={mapExample}
			alt="map example"
		/>
		<div class="card w-full p-4 lg:w-1/3">
			<div class="h-full flex-col justify-center lg:flex">
				<div class="text-3xl font-extralight uppercase tracking-wider text-accent">
					get started
				</div>
				<p class="xl:text-2xl">
					if you just want to peruse, no need to create an account. just head to the
					<a href="/explore">explore</a> page.
				</p>
				<div
					class="hidden text-3xl font-extralight uppercase tracking-wide text-accent lg:flex"
				>
					learn more
				</div>
				<p class="xl:text-2xl">
					to learn more about how it all works, head to the
					<a href="/about">about</a> page.
				</p>
			</div>
		</div>
	</div>
	<div class="card w-full bg-base-200 p-4">
		<div class="text-2xl tracking-wide text-accent">do it for the culture</div>
		<p class="mb-0 xl:text-xl">
			pooledhouse was created purely as a project intended for the good of the culture of the
			restaurant industry. it will always be completely free, and reviews will always be anonymous.
		</p>
	</div>
</div>
