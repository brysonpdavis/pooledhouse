<script lang="ts">
	import mapExample from '$lib/assets/map-example.png';
	import SplashSection from './SplashSection.svelte';
</script>

<div class="flex flex-col items-center gap-16">
	<div class="flex flex-col items-center pt-20 sm:pt-24 lg:pt-32 ">
		<h3
			class="my-0 max-w-5xl text-center text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
		>
			a workplace transparency platform for restaurant workers in NYC
		</h3>
		<p class="mt-6 mb-0 max-w-3xl text-center text-lg">
			see what other industry workers have to say, write your own anonymous workplace reviews, and
			verify your friends or coworkers as industry workers to build the team
		</p>
	</div>
	<div class="flex w-full flex-col gap-8 lg:flex-row">
		<SplashSection
			href="/explore"
			titleText="take a peek"
			bodyText="see what other industry workers say about their workplace, or compare places in the city"
			buttonText="explore"
		/>
		<SplashSection
			href="/auth/register"
			titleText="do some paperwork"
			bodyText="after registering as a verified restaurant worker, you can join the conversation and verify your friends or coworkers"
			buttonText="register"
		/>
		<SplashSection
			href="/contribute"
			titleText="share your perspective"
			bodyText="let everyone know what it's really like behind the curtain at your past or present places of work, anonymously"
			buttonText="contribute"
		/>
	</div>
	<div class="flex max-w-7xl flex-col-reverse lg:flex-row lg:gap-8">
		<img
			class="card-bordered card m-0 w-full rounded-md border-8 border-base-200 lg:w-2/3"
			src={mapExample}
			alt="map example"
		/>
		<div class="card w-full p-4 lg:w-1/3">
			<div class="h-full flex-col justify-center lg:flex">
				<div class="text-2xl font-extrabold uppercase tracking-wider text-accent">get started</div>
				<p class="xl:text-xl">
					if you just want to peruse, no need to create an account. just head to the
					<a href="/explore">explore</a> page to see what people are saying.
				</p>
				<div class="hidden text-2xl font-extrabold uppercase tracking-wider text-accent lg:flex">
					learn more
				</div>
				<p class="xl:text-xl">
					to learn more about how it all works, head to the
					<a href="/about">about</a> page.
				</p>
			</div>
		</div>
	</div>
	<div class="card w-full max-w-7xl bg-base-200 p-8">
		<div class="text-2xl font-extrabold uppercase tracking-wider text-accent">for the culture</div>
		<p class="mb-0 lg:text-xl">
			pooledhouse was created purely as a project intended for the good of the culture of the
			restaurant industry. it will always be completely free, and reviews will always be anonymous.
		</p>
	</div>
</div>
