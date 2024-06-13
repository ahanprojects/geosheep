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
	import shpjs from 'shpjs';
	import { cn } from '$lib/utils/shadcn-utils';
	import GeoJsonVtLayer from '$lib/components/GeoJsonVTLayer.svelte';

	let geojsonList: shpjs.FeatureCollectionWithFilename[] = [];

	let fileInput: HTMLInputElement
	let leafletMap: LeafletMap;
	let showLayerMenu = false;
	let showDropOverlay = false;
	let showLoader = false;

	function handleDrop(e: DragEvent) {
		const file = e.dataTransfer?.files[0];
		processZip(file!)
	}

	function handleUpload(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		if (!files || files.length == 0) return
		processZip(files[0])
	}

	async function processZip(file: File) {
		if (!file || !file.name.endsWith('.zip')) return;

		showLoader = true;
		const buffer = await file.arrayBuffer();
		const geojson = await shpjs(buffer);
		if (Array.isArray(geojson)) {
			geojsonList = [...geojsonList, ...geojson];
		} else {
			geojsonList = [...geojsonList, geojson];
		}
		showLoader = false;
	}
</script>

<svelte:window
	on:dragenter={(e) => {
		e.preventDefault();
		showDropOverlay = true;
	}}
/>

<main class="relative h-screen">
	<LeafletMap bind:this={leafletMap} options={DEFAULT_MAP_OPTIONS}>
		<TileLayer url={DEFAULT_TILE_URL} options={DEFAULT_TILE_LAYER_OPTIONS} />
		{#each geojsonList as geojson (geojson.fileName)}
			<GeoJsonVtLayer data={geojson} map={leafletMap.getMap()} />
		{/each}
	</LeafletMap>
	<div class="absolute left-2 top-2 z-[701]">
		<button
			on:click={() => {
				showLayerMenu = !showLayerMenu;
			}}
			class="mb-2 rounded-lg bg-white p-2 hover:bg-gray-200"
		>
			<Layers2 class="h-5 w-5" />
		</button>
		{#if showLayerMenu}
			<div class="w-64 rounded-lg bg-white p-4">
				<div class="flex items-center justify-between">
					<h3 class="text-base font-semibold">Layers</h3>
					<button on:click={() => fileInput.click()}>
						<Plus class="h-5 w-5" />
						<input bind:this={fileInput} type="file" class="hidden" accept=".zip" on:change={handleUpload}>
					</button>
				</div>
				<ul class={cn('space-y-2', geojsonList.length > 0 && 'mt-4')}>
					{#each geojsonList as geojson}
						<li class="flex items-center gap-2">
							<Image class="h-4 w-4 text-slate-400" />
							<span class="text-sm text-slate-600">{geojson.fileName}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>

	{#if showDropOverlay}
		<div
			on:drop={(e) => {
				e.preventDefault();
				showDropOverlay = false;
				handleDrop(e);
			}}
			on:dragleave={(e) => {
				e.preventDefault();
				showDropOverlay = false;
			}}
			on:dragover={(e) => {
				e.preventDefault();
			}}
			role="region"
			class={cn(
				'fixed left-0 top-0 z-[800] flex h-screen w-screen items-center justify-center bg-slate-500 bg-opacity-75 text-5xl font-semibold text-white'
			)}
		>
			Drop you zip shapefile
		</div>
	{/if}

	{#if showLoader}
		<div
			class="fixed top-0 z-[900] flex h-screen w-screen items-center justify-center bg-black bg-opacity-50"
		>
			<div class="rounded-xl bg-white p-4 shadow-xl">
				<img src="/favicon.png" alt="Loading..." class="h-10 w-10 animate-spin" />
			</div>
		</div>
	{/if}
</main>
