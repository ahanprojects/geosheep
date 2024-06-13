<script>
	import '@fontsource-variable/manrope';
	import '../app.css';
</script>

<svelte:head>
	<title>GeoSheep - Geospatial Data Viewer</title>
</svelte:head>

<slot></slot>

<style>
	:global(body) {
		font-family: 'Manrope Variable', sans-serif;
	}
</style>
