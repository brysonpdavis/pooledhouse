<script lang="ts">
	import { onMount } from 'svelte';
	import { Loader } from '@googlemaps/js-api-loader';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
	import { postPlace } from '$lib/handlers/places';
	import { page } from '$app/stores';
	import type { Place } from '@prisma/client';

	export let places: Place[];

	const optimize = places.length > 50;

	const loggedIn = $page.data.session?.user;

	let googleApi: typeof google;
	let map: google.maps.Map;
	let currentPlace: google.maps.places.PlaceResult | undefined;
	let infoWindow: google.maps.InfoWindow;
	let infoWindowContent: HTMLElement;
	let uploadSuccess = false;
	let uploadInProgress = false;

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

			// this will position the location input
			map.controls[google.maps.ControlPosition.TOP_LEFT].push(
				document.getElementById('pac-input-container')!
			);

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

	function addMarker(
		location: google.maps.LatLngLiteral,
		map: google.maps.Map,
		options?: {
			label: string;
			title: string;
		}
	) {
		new googleApi.maps.Marker({
			position: location,
			...options,
			map
		});
	}

	async function addPlaceMarkers(map: google.maps.Map, places: Place[]) {
		// change color of each marker based on value?
		places.forEach((place) => {
			const m = new googleApi.maps.Marker({
				position: { lat: place.lat, lng: place.lng },
				optimized: optimize,
				title: place.name,
				map
			});

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
			addMarker(
				{
					lat: currentPlace.geometry?.location?.lat()!,
					lng: currentPlace.geometry?.location?.lng()!
				},
				map
			);
		}

		uploadInProgress = false;
		uploadSuccess = res !== 'error';
	}

	type InfoWindowOpenAnchorType = Parameters<(typeof infoWindow)['open']>[1];

	function popUpInfoWindow(place: Place, anchor: InfoWindowOpenAnchorType) {
		// TODO: add new info items here
		infoWindowContent.children.namedItem('place-name')!.textContent = place.name;
		infoWindowContent.children.namedItem('place-id')!.textContent = place.id;
		infoWindowContent.children.namedItem('place-address')!.textContent = place.address;

		infoWindow.open(map, anchor);
	}
</script>

<div id="pac-input-container">
	<input
		id="pac-input"
		class="input-secondary input m-4"
		type="text"
		placeholder="Enter a location"
	/>

	<button
		disabled={!loggedIn ||
			!currentPlace ||
			!!places.find((p) => p.googlePlaceId === currentPlace?.place_id)}
		class="loading btn-primary btn"
		class:loading={uploadInProgress}
		on:click={() => handleClickAdd()}
	>
		{#if !uploadInProgress}add{/if}
	</button>
</div>
<div id="map" class="flex h-full w-full" />
<div id="info-window-content">
	<!-- TODO: ADD OTHER INFO ITEMS TO DISPLAY -->
	<div id="place-name" class="font-semibold"><!-- --></div>
	<div id="place-address"><!-- --></div>
	<div id="place-id"><!-- --></div>
</div>

<style>
	#info-window-content {
		display: none;
	}

	:global(#map #info-window-content) {
		display: inline;
	}
</style>
