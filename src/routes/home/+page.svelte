<script lang="ts">
	// @ts-ignore
	import MapExample from '$lib/assets/map-example.png?format=webp'
	import SplashSection from './SplashSection.svelte'
</script>

<div class="flex flex-col items-center gap-8 lg:gap-16">
	<div class="flex flex-col items-center pt-10 sm:pt-24 lg:pt-32">
		<h1
			class="text-balance my-0 max-w-5xl text-center text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
		>
			workplace transparency for restaurant workers in NYC
		</h1>
		<p class="text-balance mb-0 mt-6 max-w-3xl text-center text-xl" style="text-wrap:balance;">
			pooledhouse is a platform for restaurant workers to share their experiences and help each
			other find better jobs
		</p>
	</div>
	<div class="flex w-full flex-col gap-8 lg:flex-row">
		<SplashSection
			href="/explore"
			titleText="discover & compare"
			bodyText="dive into real insights from fellow industry professionals. browse honest reviews and compare workplaces across NYC to find your ideal job match."
			buttonText="explore"
		/>
		<SplashSection
			href="/auth/register"
			titleText="connect & engage"
			bodyText="as a verified restaurant worker, engage freely on our platform. post your experiences, react to others' stories, and connect with your peers."
			buttonText="register"
		/>
		<SplashSection
			href="/contribute"
			titleText="voice your experience"
			bodyText="your perspective matters. join the community dialogue and guide others in making well-informed employment decision."
			buttonText="contribute"
		/>
	</div>
	<div class="flex max-w-7xl flex-col-reverse lg:flex-row lg:gap-8">
		<img
			class="card-bordered card m-0 w-full rounded-md border-8 border-base-200 lg:w-2/3"
			src={MapExample}
			alt="map example"
		/>
		<div class="card w-full p-4 lg:w-1/3">
			<div class="h-full flex-col justify-center lg:flex">
				<div class="text-2xl font-extrabold uppercase tracking-wider text-accent">get started</div>
				<p class="xl:text-xl">
					just browsing? no account needed. simply visit the <a href="/explore">explore</a>
					page to gauge the pulse of the NYC restaurant scene.
				</p>
				<!-- <div class="hidden text-2xl font-extrabold uppercase tracking-wider text-accent lg:flex">
					learn more
				</div>
				<p class="xl:text-xl">
					to learn more about how it all works, head to the
					<a href="/about">about</a> page.
				</p> -->
			</div>
		</div>
	</div>
	<div class="card w-full max-w-7xl bg-base-200 p-4">
		<div class="text-2xl font-extrabold uppercase tracking-wider text-accent">for the culture</div>
		<p class="mb-0 lg:text-xl">
			built for the heart of the restaurant industry. pooledhouse remains free, dedicated to the
			culture, and guarantees anonymity of reviews.
		</p>
	</div>
</div>
