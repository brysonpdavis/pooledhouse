<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { Loader } from '@googlemaps/js-api-loader';
	import 'iconify-icon';

	import { PUBLIC_GOOGLE_MAPS_API_KEY, PUBLIC_GOOGLE_MAPS_MAP_ID } from '$env/static/public';
	import { postPlace } from '$lib/handlers/places';
	import { page } from '$app/stores';
	import type { Place } from '@prisma/client';
	import { shadeColor } from '$lib/utils/colors';
	import Loading from '$lib/components/Loading.svelte';
	import AddPlaceButton from './AddPlaceButton.svelte';
	import { scoreColorGradient } from '$lib/utils/colors';
	import { sleep } from '$lib/utils/async';

	export let places: Place[];

	const loggedIn = $page.data.session?.user;

	const NO_SCORE_MARKER_COLOR = '#777777';
	const INITIAL_MARKER_DROP_ANIMATION_SECONDS = 1.5;
	const NYC_COORDINATES = { lat: 40.73, lng: -73.93 };

	let googleLibraries: {
		maps: google.maps.MapsLibrary;
		markers: google.maps.MarkerLibrary;
		places: google.maps.PlacesLibrary;
		core: google.maps.CoreLibrary;
	};

	const googlePlaceIdToExistingPlaceDict: Map<
		string,
		{ data: Place; marker: google.maps.marker.AdvancedMarkerElement }
	> = new Map();

	let map: google.maps.Map;
	let tempMarker: google.maps.marker.AdvancedMarkerElement;
	let currentAutocompletePlace: google.maps.places.PlaceResult | undefined;
	let autocompletePlaceInfoWindow: google.maps.InfoWindow;
	let infoWindow: google.maps.InfoWindow;
	let popUpInfoWindowPlace: Place | undefined = places.at(0);

	let showFilters = false;
	let hideUnreviewed = false;

	let placeIdsToHide = new Set<string>();

	let initialLoading = true;
	let uploadSuccess = false;
	let uploadInProgress = false;

	$: popUpInfoWindowPlacePageUrl = !!popUpInfoWindowPlace
		? `/places/${popUpInfoWindowPlace.id}`
		: '/';

	$: canAddPlace =
		!!loggedIn &&
		!!currentAutocompletePlace &&
		!places.find((p) => p.googlePlaceId === currentAutocompletePlace?.place_id);

	$: {
		const placeIdsToHideTemp = new Set<string>();

		if (hideUnreviewed) {
			for (const p of places) {
				if (p.workplaceScore === null) {
					placeIdsToHideTemp.add(p.googlePlaceId);
				}
			}
		}

		// TODO: add new filters here vvv

		placeIdsToHide = placeIdsToHideTemp;
	}

	$: {
		for (const { data, marker } of googlePlaceIdToExistingPlaceDict.values()) {
			if (placeIdsToHide.has(data.googlePlaceId)) {
				marker.map = null;
			} else {
				marker.map = map;
			}
		}
	}

	const loader = new Loader({
		apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
		version: 'beta',
		libraries: ['places', 'marker'],
		authReferrerPolicy: 'origin'
	});

	const mapOptions: google.maps.MapOptions = {
		center: NYC_COORDINATES,
		zoom: 11,
		clickableIcons: false,
		disableDefaultUI: true,
		mapId: PUBLIC_GOOGLE_MAPS_MAP_ID
	};

	onMount(initializeMap);

	async function initializeMap() {
		places.sort((p1, p2) => p2.lat - p1.lat);

		await importGoogleMapsLibraries();

		const { Map, Circle, InfoWindow } = googleLibraries.maps;
		const { AdvancedMarkerElement, PinElement } = googleLibraries.markers;
		const { Autocomplete } = googleLibraries.places;
		const { LatLng, ControlPosition } = googleLibraries.core;

		map = new Map(document.getElementById('map')!, mapOptions);

		// temp marker for searched places
		tempMarker = new AdvancedMarkerElement({
			map,
			content: new PinElement({
				borderColor: '#007FFF',
				background: '#007FFF',
				glyphColor: 'white'
			}).element
		});

		tempMarker.element.onmouseover = () => popUpInfoWindowForCurrentAutocompletePlace();

		initialLoading = false;

		const infoWindowContent = document.getElementById('info-window-content') as HTMLElement;
		infoWindow = new InfoWindow({ content: infoWindowContent });

		const autocompletePlaceInfoWindowContent = document.getElementById(
			'autocomplete-place-info-window-content'
		) as HTMLElement;
		autocompletePlaceInfoWindow = new InfoWindow({ content: autocompletePlaceInfoWindowContent });

		const input = document.getElementById('pac-input') as HTMLInputElement;
		const autocomplete = new Autocomplete(input, {
			fields: ['place_id', 'name', 'formatted_address', 'geometry'],
			types: ['restaurant', 'night_club', 'cafe', 'bar', 'casino'],
			bounds: new Circle({
				center: new LatLng(NYC_COORDINATES.lat, NYC_COORDINATES.lng),
				radius: 12000
			}).getBounds()!,
			strictBounds: true
		});

		const pacInputContainer = document.getElementById('pac-input-container')!;

		// this will position the location input
		map.controls[ControlPosition.TOP_LEFT].push(pacInputContainer);

		const filterButton = document.getElementById('filter-button-container')!;

		map.controls[ControlPosition.TOP_RIGHT].push(filterButton);

		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();

			console.log('place: ', place);

			currentAutocompletePlace = autocomplete.getPlace();

			if (!place.geometry || !place.geometry.location) {
				return;
			}

			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}

			const existingPlace = googlePlaceIdToExistingPlaceDict.get(place.place_id!);

			if (existingPlace) {
				popUpInfoWindow(existingPlace.data, existingPlace.marker);
			} else {
				tempMarker.position = place.geometry.location;
				tempMarker.title = place.name || '';
			}

			popUpInfoWindowForCurrentAutocompletePlace();
		});

		createPlaceMarkers(places);
	}

	async function createPlaceMarkers(places: Place[]) {
		// change color of each marker based on value
		for (const place of places) {
			const markerColor =
				place.workplaceScore !== null
					? `#${scoreColorGradient.colorAt(place.workplaceScore)}`
					: NO_SCORE_MARKER_COLOR;

			createMarkerFromPlace(place, markerColor);

			await sleep((INITIAL_MARKER_DROP_ANIMATION_SECONDS * 1000) / places.length);
		}
	}

	function createMarkerFromPlace(place: Place, markerColor: string) {
		const marker = new googleLibraries.markers.AdvancedMarkerElement({
			position: { lat: place.lat, lng: place.lng },
			content: new googleLibraries.markers.PinElement({
				borderColor: shadeColor(markerColor, -30),
				background: markerColor,
				glyphColor: shadeColor(markerColor, -30),
				glyph: null
			}).element,
			map
		});

		marker.content!.classList.add('drop');

		marker.content!.addEventListener('animationend', () =>
			marker.content!.classList.remove('drop')
		);

		const markerElement = marker.element;

		if (markerElement) {
			markerElement.onmouseover = () => {
				popUpInfoWindow(place, marker);
			};
		}

		marker.addListener('dblclick', () => {
			map.setCenter({ lat: place.lat, lng: place.lng });
			map.setZoom(17);
		});

		marker.addListener('mouseover', () => {
			// pop up info card
			popUpInfoWindow(place, marker);
		});

		marker.addEventListener('gmp-click', () => {
			popUpInfoWindow(place, marker);
			bounceAnimation(marker);
		});

		googlePlaceIdToExistingPlaceDict.set(place.googlePlaceId, { data: place, marker });

		return marker;
	}

	function bounceAnimation(marker: google.maps.marker.AdvancedMarkerElement) {
		marker.content?.classList.add('bounce');

		marker.content?.addEventListener('animationend', () =>
			marker.content?.classList.remove('bounce')
		);
	}

	async function handleClickAdd() {
		if (!currentAutocompletePlace) {
			return;
		}

		uploadInProgress = true;

		const postedPlace = await postPlace({
			name: currentAutocompletePlace.name!,
			googlePlaceId: currentAutocompletePlace.place_id!,
			address: currentAutocompletePlace.formatted_address || currentAutocompletePlace.adr_address!,
			lat: currentAutocompletePlace.geometry?.location?.lat()!,
			lng: currentAutocompletePlace.geometry?.location?.lng()!,
			createdByUserEmail: $page.data.session?.user?.email!
		});

		if (postedPlace !== 'error') {
			places.push(postedPlace);
			places = places;
			popUpInfoWindow(postedPlace, createMarkerFromPlace(postedPlace, NO_SCORE_MARKER_COLOR));
			autocompletePlaceInfoWindow.close();
		}

		uploadInProgress = false;
		uploadSuccess = postedPlace !== 'error';
	}

	type InfoWindowOpenAnchorType = Parameters<(typeof infoWindow)['open']>[1];

	function popUpInfoWindow(place: Place, anchor: InfoWindowOpenAnchorType) {
		popUpInfoWindowPlace = place;
		infoWindow.open(map, anchor);
	}

	function popUpInfoWindowForCurrentAutocompletePlace() {
		if (!currentAutocompletePlace?.place_id) return;

		const existingPlace = googlePlaceIdToExistingPlaceDict.get(currentAutocompletePlace.place_id);

		if (!!existingPlace) {
			existingPlace.marker.map = map;
			popUpInfoWindow(existingPlace.data, existingPlace.marker);
		} else {
			autocompletePlaceInfoWindow.open(map, tempMarker);
		}
	}

	async function importGoogleMapsLibraries() {
		const [maps, markers, placesLibrary, core] = await Promise.all([
			loader.importLibrary('maps'),
			loader.importLibrary('marker'),
			loader.importLibrary('places'),
			loader.importLibrary('core')
		]);

		googleLibraries = { maps, markers, places: placesLibrary, core };
	}
</script>

{#if initialLoading}
	<Loading />
{/if}

<div class="flex h-full w-full flex-col gap-4">
	{#if showFilters}
		<div class="h-1/4 bg-base-200 p-4" transition:slide>
			<input type="checkbox" id="show-unreviewed" bind:checked={hideUnreviewed} />
			<label for="show-unreviewed">hide places with no reviews</label>
		</div>
	{/if}

	<div id="map" class="flex w-full flex-grow" />
</div>

<div id="pac-input-container" class="animate-fade">
	<input
		id="pac-input"
		class="input-secondary input m-4"
		type="text"
		placeholder="Enter a location"
	/>
	{#if canAddPlace}
		<AddPlaceButton {handleClickAdd} {uploadInProgress} />
	{/if}
</div>
<div id="autocomplete-place-info-window-content">
	{#if currentAutocompletePlace?.name}
		<div id="place-name" class="font-sans text-lg font-semibold text-accent">
			{currentAutocompletePlace.name}
		</div>
	{/if}
	{#if currentAutocompletePlace?.formatted_address}
		<div class="font-sans text-base-100" id="place-address">
			{currentAutocompletePlace.formatted_address}
		</div>
	{/if}
</div>
<div id="info-window-content">
	<!-- TODO: ADD OTHER INFO ITEMS TO DISPLAY -->
	<div id="place-name" class="font-sans text-lg font-semibold">
		<a id="place-link" class="text-accent hover:no-underline" href={popUpInfoWindowPlacePageUrl}>
			{popUpInfoWindowPlace?.name || 'name'}
		</a>
	</div>
	<div class="font-sans text-base-100" id="place-address">
		{popUpInfoWindowPlace?.address || 'address'}
	</div>
</div>
<div id="filter-button-container">
	<button
		class="btn-square btn m-4 border-secondary bg-base-200 hover:bg-base-100 hover:text-accent"
		on:click={() => (showFilters = !showFilters)}
		><iconify-icon class="text-2xl" class:text-accent={showFilters} icon="ph:sliders" /></button
	>
</div>

<style>
	/* these css properties will make the elements hidden  
	** until they have been added to the map 
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

	#filter-button-container {
		display: none;
	}

	:global(#map #filter-button-container) {
		display: inline;
	}

	/* these css properties and keyframes are for adding css animations to the google maps markers */

	@keyframes -global-drop {
		0% {
			transform: translateY(-350px) scaleY(0.9);
			opacity: 0;
		}
		5% {
			opacity: 0.7;
		}
		50% {
			transform: translateY(0px) scaleY(1);
			opacity: 1;
		}
		65% {
			transform: translateY(-17px) scaleY(0.9);
			opacity: 1;
		}
		75% {
			transform: translateY(-22px) scaleY(0.8);
			opacity: 1;
		}
		100% {
			transform: translateY(0px) scaleY(1);
			opacity: 1;
		}
	}

	:global(.drop) {
		animation: drop 0.3s linear normal;
	}

	@keyframes -global-bounce {
		0% {
			transform: scaleY(1);
		}

		10% {
			transform: translateY(8px) scaleY(0.8);
		}

		100% {
			transform: scaleY(1);
		}
	}

	:global(.bounce) {
		animation: bounce 0.2s linear normal;
	}
</style>
