<script lang="ts">
	import mapExample from '$lib/assets/map-example.png';
</script>

<div class="flex flex-col gap-8">
	<h3 class="mb-0 mt-4 font-light md:text-4xl">
		a workplace transparency platform for restaurant workers in NYC
	</h3>
	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="card-bordered card p-4 lg:w-1/3">
			<div class="flex flex-grow flex-row items-center justify-between gap-4">
				<div class="flex-grow">
					<div class="card-title text-accent">looking for a new gig? just curious?</div>
					<p>
						see what other restaurant workers say about their workplace, or compare places in the
						city
					</p>
				</div>
				<a class="btn-outline btn-secondary btn-lg btn h-full" href="/explore">explore</a>
			</div>
		</div>
		<div class="card-bordered card p-4 lg:w-1/3">
			<div class="flex flex-grow flex-row items-center justify-between gap-4 lg:flex-row-reverse">
				<a class="btn-outline btn-secondary btn-lg btn h-full" href="/auth/register">register</a>
				<div class="flex-grow">
					<div class="card-title justify-end text-accent lg:justify-start">join the team</div>
					<p class="text-right lg:text-left">
						after registering as a verified restaurant worker, you can verify your friends or
						coworkers and join the conversation
					</p>
				</div>
			</div>
		</div>
		<div class="card-bordered card p-4 lg:w-1/3">
			<div class="flex flex-grow flex-row items-center justify-between gap-4">
				<div class="flex-grow">
					<div class="card-title text-accent">share perspective on your own workplace</div>
					<p>
						let everyone know what it's really like behind the curtain at your place of work,
						anonymously
					</p>
				</div>
				<a class="btn-outline btn-secondary btn-lg btn h-full" href="/explore">contribute</a>
			</div>
		</div>
	</div>
	<img class="card-bordered card m-0 w-fit rounded-md" src={mapExample} alt="map example" />
</div>
