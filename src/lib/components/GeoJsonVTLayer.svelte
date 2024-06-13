<script context="module" lang="ts">
	const DEFAULT_VT_OPTIONS = {
		maxZoom: 14,
		minZoom: 0,
		maxNativeZoom: 17,
		minNativeZoom: 5,
		tolerance: 5,
		style: { color: '#0000ff', fillColor: '#0000ff4d', weight: 1 }
	};
</script>

<script lang="ts">
	import { vt } from '$lib/utils/vt';

	import shpjs from 'shpjs';
	import { onDestroy, onMount } from 'svelte';

	export let data: shpjs.FeatureCollectionWithFilename;
	export let map: L.Map | undefined;

	let tile: any;

	onMount(() => {
		tile = vt(data, DEFAULT_VT_OPTIONS);
		map?.addLayer(tile);
	});

	onDestroy(() => {
		map?.removeLayer(tile);
	});
</script>
