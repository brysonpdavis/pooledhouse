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
	let map: google.maps.Map;
	let currentPlace: google.maps.places.PlaceResult | undefined;
	let googleApi: typeof google;
	let uploadSuccess = false;

	const nycCoordinates = { lat: 40.73, lng: -73.9 };

	const loader = new Loader({
		apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
		version: 'weekly',
		libraries: ['places']
	});

	const mapOptions: google.maps.MapOptions = {
		center: nycCoordinates,
		zoom: 11,
		clickableIcons: false,
		disableDefaultUI: true,
		disableDoubleClickZoom: true
	};

	onMount(async () => {
		loader.load().then(async (google) => {
			googleApi = google;

			const autocompleteBounds = new google.maps.Circle({
				center: new google.maps.LatLng(nycCoordinates.lat, nycCoordinates.lng),
				radius: 12000
			}).getBounds()!;

			map = new google.maps.Map(document.getElementById('map')!, mapOptions);
			const marker = new google.maps.Marker({ map });
			const input = document.getElementById('pac-input') as HTMLInputElement;
			const autocomplete = new google.maps.places.Autocomplete(input, {
				fields: ['place_id', 'name', 'formatted_address', 'geometry'],
				types: ['restaurant', 'night_club', 'cafe', 'bar', 'casino'],
				bounds: autocompleteBounds,
				strictBounds: true
			});

			// this will position the location input
			// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input)

			google.maps.event.addListener(
				map,
				'dblclick',
				(event: { latLng: google.maps.LatLngLiteral }) => {
					addMarker(event.latLng, map);
					return false;
				}
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

				// @ts-ignore
				marker.setPlace({
					placeId: place.place_id,
					location: place.geometry.location
				});
			});

			addAllMarkers(map, places);
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

	async function addAllMarkers(map: google.maps.Map, places: Place[]) {
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
				console.log('mouse over ', place.name);
			});

			m.addListener('mouseout', () => {
				// close info card
				console.log('mouse out ', place.name);
			});
		});
	}

	async function handleClickAdd() {
		if (!currentPlace) {
			return;
		}

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

		uploadSuccess = res !== 'error';
	}
</script>

<input id="pac-input" class="input-secondary input mb-4" type="text" placeholder="Enter a location" />
<button disabled={!loggedIn || !currentPlace} class="btn-primary btn" on:click={() => handleClickAdd()}>
	add
</button>
<div id="map" class="flex h-[80vh] w-full" />
