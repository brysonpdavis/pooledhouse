<script lang="ts">
	import mapExample from '$lib/assets/map-example.png'
</script>

<div>
	<h3>
		pooledhouse is a workplace review and transparency platform for restaurant workers, currently
		only available in nyc.
	</h3>
	<div class="flex flex-col lg:flex-row">
		<div class="card-bordered card m-4  p-4 lg:w-1/3">
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
		<div class="card-bordered card m-4 p-4 lg:w-1/3">
			<div class="flex flex-grow flex-row items-center justify-between gap-4 lg:flex-row-reverse">
				<a class="btn-outline btn-secondary btn-lg btn h-full" href="/auth/register">register</a>
				<div class="flex-grow">
					<div class="card-title justify-end text-accent lg:justify-start">join the team</div>
					<p>
						after registering as a verified restaurant worker, you can verify your friends or
						coworkers and join the conversation
					</p>
				</div>
			</div>
		</div>
		<div class="card-bordered card m-4  p-4 lg:w-1/3">
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
	<img class="card card-bordered rounded-md w-fit" src={mapExample} alt='map example'/>
</div>
