<script>
	import HeartSvg from '$lib/components/HeartSvg.svelte';

	import { page } from '$app/stores';
</script>

<h1>welcome to pooledhouse</h1>

<h2>a workplace review platform for the service industry</h2>

<p>
	pooledhouse is a platform for workers at restaurants, cafes, bars, and clubs to share their
	experience of employment in their workplaces with other service industry workers and the general
	public. it is an open platform where all information contributed by verified industry workers is
	publicly visible and anonymous.
</p>

<p>
	the hope in creating this project is that it will lead to healthier workplace norms across the
	service industry by increasing workplace transparency in regards to satisfaction with
	compensation, work hours, clientele, lifestyle balance, and more. hopefully, by creating a place
	where workers are encouraged to share their work experiences openly, we can all build better
	establishments for ourselves and the guests who pass through our doors.
</p>

<p>
	there is also a yelp-like component to the platform where verified industry workers can share
	their experiences of their favorite (or least favorite!) establishments from the perspective of a
	patron, hopefully creating a place where public users can discover a unique perspective on the
	establishments they frequent or where industry workers can go to find restaurants loved by others
	with a common perspective.
</p>

<h2>how it works</h2>

<p>
	in the spirit of openness and integrity, all of the information on pooledhouse is publicly
	available to anyone who visits the app, however, new information can only be contributed by
	accounts that have been verified as owned by industry workers.
</p>

<p>
	to attempt to cut down on the friction of onboarding new users, the verification process is
	simple. if you have an account and are already verified, you can visit
	<a href="/verify">{$page.url.host}/verify</a> to generate verification codes and give them to your
	friends to input into their accounts. if they have an account but are not verified yet, then they
	can input their verification code at the same url, <a href="/verify">{$page.url.host}/verify</a>.
	and if they haven't made an account yet, there is a place to input a verification code upon sign
	up.
</p>

<p>
	to cut down on spam while encouraging new users to the platform, each verified account has one
	workplace review credit at the moment of creation, which can be used to write one workplace review
	(ideally, your current job). if you would like to write more workplace reviews, all you have to do
	is invite your industry friends to the platform. each verification code that you use to
	successfully verify a new account will earn you another workplace review credit to write workplace
	reviews for other establishments (previous jobs, concurrent jobs, etc.)
</p>

<h2>who built this?</h2>

<p>
	pooledhouse was created by a team of one, which is me: bryson davis. i'm a bartender and software
	engineer working and living life in nyc. if you want to check out any of my other projects on
	github, feel free to check those out <a href="https://www.github.com/brysonpdavis">here</a>. and
	if you want to get in touch, or if you have any feedback on the app, my email is
	<a href="mailto: hey@brysondavis.dev">hey@brysondavis.dev</a>. i'm always open to new connections,
	opportunities, or critiques, so if you have anything to share, please say hi!
</p>

<h3>peace and love <HeartSvg /></h3>
