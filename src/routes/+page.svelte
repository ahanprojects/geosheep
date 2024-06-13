<script lang="ts">
	import { Image, Layers, Layers2, Plus } from 'lucide-svelte';
	import { GeoJSON, LeafletMap, TileLayer } from 'svelte-leafletjs';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import {
		DEFAULT_MAP_OPTIONS,
		DEFAULT_TILE_LAYER_OPTIONS,
		DEFAULT_TILE_URL
	} from '$lib/utils/constants';
	import shpjs, { parseShp } from 'shpjs';
	import { vt } from '$lib/utils/vt';

	let leafletMap: LeafletMap;
	let openLayerMenu = false;
	let layers = [1, 2, 3, 4, 5, 6];

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files[0];

		if (!file) return;
		if (!(file.name.endsWith('.shp') || file.name.endsWith('.zip'))) return;

		const buffer = await file.arrayBuffer();
		const isShp = file.name.endsWith('.shp');
		const geojsonData = isShp ? parseShp(buffer) : await shpjs(buffer);
		const map = leafletMap.getMap();
		if (map) {
			const vtOptions = {
				maxZoom: 24,
				minZoom: 0,
				maxNativeZoom: 17,
				minNativeZoom: 5,
				tolerance: 5,
				style: { color: '#0000ff', fillColor: '#0000ff4d', weight: 1 }
			};

			const tile = vt(geojsonData, vtOptions)
			map.addLayer(tile)
			// const geojson = L.geoJSON(geojsonData).addTo(map)
			// map.fitBounds(geojson.getBounds())
		}
	}
</script>

<svelte:window on:dragover={(e) => e.preventDefault()} on:drop={handleDrop} />

<main class="relative h-screen">
	<LeafletMap bind:this={leafletMap} options={DEFAULT_MAP_OPTIONS}>
		<TileLayer url={DEFAULT_TILE_URL} options={DEFAULT_TILE_LAYER_OPTIONS} />
	</LeafletMap>
	<div class="absolute left-2 top-2 z-[999]">
		<button
			on:click={() => {
				openLayerMenu = !openLayerMenu;
			}}
			class="mb-2 rounded-lg bg-white p-2 hover:bg-gray-200"
		>
			<Layers2 class="h-5 w-5" />
		</button>
		{#if openLayerMenu}
			<div class="w-64 rounded-lg bg-white p-4">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-base font-semibold">Layers</h3>
					<button>
						<Plus class="h-5 w-5" />
					</button>
				</div>
				<ul class="space-y-2">
					{#each layers as layer}
						<li class="flex items-center gap-2">
							<Image class="h-4 w-4 text-slate-400" />
							<span class="text-sm text-slate-600">Layer {layer}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</main>
