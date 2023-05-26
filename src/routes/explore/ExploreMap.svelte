<script lang="ts">
	import { onMount } from 'svelte';
	import { Loader } from '@googlemaps/js-api-loader';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
	import { postPlace } from '$lib/handlers/places';
	import { page } from '$app/stores';
	import type { Place } from '@prisma/client';
	import { rainbow } from '@indot/rainbowvis';
	import { shadeColor } from '$lib/utils/colors';

	export let places: Place[];

	const loggedIn = $page.data.session?.user;

	$: canAddPlace =
		loggedIn && currentPlace && !places.find((p) => p.googlePlaceId === currentPlace?.place_id);

	const NO_SCORE_MARKER_COLOR = '#777777';

	const markerColorGradient = rainbow()
		.overColors(
			...['#f87171', '#fb923c', '#facc15', '#a3e635', '#4ade80'].map((c) => shadeColor(c, -10))
		)
		.withRange(0, 100);

	let googleApi: typeof google;
	let map: google.maps.Map;
	let currentPlace: google.maps.places.PlaceResult | undefined;
	let infoWindow: google.maps.InfoWindow;
	let infoWindowContent: HTMLElement;
	let popUpInfoWindowPlace: Place | undefined = places.at(0);
	let uploadSuccess = false;
	let uploadInProgress = false;

	$: popUpInfoWindowPlacePageUrl = !!popUpInfoWindowPlace
		? `/explore/places/${popUpInfoWindowPlace.id}`
		: '/';

	const nycCoordinates = { lat: 40.73, lng: -73.9 };

	const loader = new Loader({
		apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
		version: 'beta',
		libraries: ['places', 'marker']
	});

	const mapOptions: google.maps.MapOptions = {
		center: nycCoordinates,
		zoom: 11,
		clickableIcons: false,
		disableDefaultUI: true,
		mapId: '58085ec09961ed07'
	};

	onMount(async () => {
		places.sort((p1, p2) => p2.lat - p1.lat);

		loader.load().then(async (google) => {
			googleApi = google;

			const autocompleteBounds = new google.maps.Circle({
				center: new google.maps.LatLng(nycCoordinates.lat, nycCoordinates.lng),
				radius: 12000
			}).getBounds()!;

			map = new google.maps.Map(document.getElementById('map')!, mapOptions);
			const marker = new google.maps.marker.AdvancedMarkerView({
				map,
				content: new google.maps.marker.PinView({
					borderColor: '#007FFF',
					background: '#007FFF',
					glyphColor: 'white'
				}).element
			});

			infoWindowContent = document.getElementById('info-window-content') as HTMLElement;
			infoWindow = new google.maps.InfoWindow({ content: infoWindowContent });
			const input = document.getElementById('pac-input') as HTMLInputElement;
			const autocomplete = new google.maps.places.Autocomplete(input, {
				fields: ['place_id', 'name', 'formatted_address', 'geometry'],
				types: ['restaurant', 'night_club', 'cafe', 'bar', 'casino'],
				bounds: autocompleteBounds,
				strictBounds: true
			});

			const pacInputContainer = document.getElementById('pac-input-container')!;

			// this will position the location input
			map.controls[google.maps.ControlPosition.TOP_LEFT].push(pacInputContainer);

			autocomplete.addListener('place_changed', () => {
				const place = autocomplete.getPlace();

				console.log('place: ', place);

				currentPlace = autocomplete.getPlace();

				if (!place.geometry || !place.geometry.location) {
					return;
				}

				if (place.geometry.viewport) {
					map.fitBounds(place.geometry.viewport);
				} else {
					map.setCenter(place.geometry.location);
					map.setZoom(17);
				}

				marker.position = place.geometry.location;
				marker.title = place.name;
			});

			addPlaceMarkers(map, places);
		});
	});

	async function addPlaceMarkers(map: google.maps.Map, places: Place[]) {
		// change color of each marker based on value?
		places.forEach((place) => {
			const markerColor = place.workplaceScore !== null
				? `#${markerColorGradient.colorAt(place.workplaceScore)}`
				: NO_SCORE_MARKER_COLOR;

			const m = new googleApi.maps.marker.AdvancedMarkerView({
				position: { lat: place.lat, lng: place.lng },
				content: new google.maps.marker.PinView({
					borderColor: shadeColor(markerColor, -30),
					background: markerColor,
					glyphColor: shadeColor(markerColor, -30),
					glyph: null
				}).element,
				map
			});

			const markerElement = m.element;

			if (markerElement) {
				markerElement.onmouseover = () => {
					popUpInfoWindow(place, m);
				};
			}

			m.addListener('dblclick', () => {
				map.setCenter({ lat: place.lat, lng: place.lng });
				map.setZoom(17);
			});

			m.addListener('mouseover', () => {
				// pop up info card
				popUpInfoWindow(place, m);
			});

			m.addListener('click', () => {
				popUpInfoWindow(place, m);
			});
		});
	}

	async function handleClickAdd() {
		if (!currentPlace) {
			return;
		}

		uploadInProgress = true;

		const res = await postPlace({
			name: currentPlace.name!,
			googlePlaceId: currentPlace.place_id!,
			address: currentPlace.formatted_address || currentPlace.adr_address!,
			lat: currentPlace.geometry?.location?.lat()!,
			lng: currentPlace.geometry?.location?.lng()!,
			createdByUserEmail: $page.data.session?.user?.email!
		});

		if (res !== 'error') {
			places.push(res);
			places = places;
			addPlaceMarkers(map, [res]);
		}

		uploadInProgress = false;
		uploadSuccess = res !== 'error';
	}

	type InfoWindowOpenAnchorType = Parameters<(typeof infoWindow)['open']>[1];

	function popUpInfoWindow(place: Place, anchor: InfoWindowOpenAnchorType) {
		popUpInfoWindowPlace = place;
		infoWindow.open(map, anchor);
	}
</script>

<div id="pac-input-container" class="animate-fade">
	<input
		id="pac-input"
		class="input-secondary input m-4"
		type="text"
		placeholder="Enter a location"
	/>
	{#if canAddPlace}
		<div class="card-bordered card mx-4 h-fit w-[235px] bg-primary">
			<div class="m-2 flex flex-grow-0 flex-row text-secondary">
				<p class="my-0">that place isn't in the database yet, would you like to add it?</p>
			</div>
			<button
				disabled={!canAddPlace}
				class="btn-outline loading btn-accent btn"
				class:loading={uploadInProgress}
				on:click={() => handleClickAdd()}
			>
				{#if !uploadInProgress}add{/if}
			</button>
		</div>
	{/if}
</div>
<div id="map" class="flex h-full w-full" />
<div id="info-window-content">
	<!-- TODO: ADD OTHER INFO ITEMS TO DISPLAY -->
	<div id="place-name" class="font-sans text-lg font-semibold">
		<a id="place-link" class="text-accent hover:no-underline" href={popUpInfoWindowPlacePageUrl}
			>{popUpInfoWindowPlace?.name || 'name'}</a
		>
	</div>
	<div class="font-sans text-base-100" id="place-address">
		{popUpInfoWindowPlace?.address || 'address'}
	</div>
</div>

<style>
	/* these css properties will make the elements not  
	** visible until they have been added to the map 
	*/

	#info-window-content {
		display: none;
	}

	:global(#map #info-window-content) {
		display: inline;
	}

	#pac-input-container {
		display: none;
	}

	:global(#map #pac-input-container) {
		display: inline;
	}
</style>
