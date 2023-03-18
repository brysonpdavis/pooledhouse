<script lang="ts">
	import { onMount } from 'svelte';
	import { Loader } from '@googlemaps/js-api-loader';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

	let googleApi: typeof google;

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

			const map = new google.maps.Map(document.getElementById('map')!, mapOptions);

			google.maps.event.addListener(
				map,
				'dblclick',
				(event: { latLng: google.maps.LatLngLiteral }) => {
					addMarker(event.latLng, map);
				}
			);

			addAllMarkers(map)
		});
	});

	function addMarker(location: google.maps.LatLngLiteral, map: google.maps.Map) {
		new googleApi.maps.Marker({
			position: location,
			label: 'some',
			map
		});
	}

	function addAllMarkers(map: google.maps.Map) {
		// get all markers from endpoint
		// iterate over all markers and add each one to map
		// change color based on value?
		map;
	}
</script>

<div id="map" class="my-4 h-full w-full" />
