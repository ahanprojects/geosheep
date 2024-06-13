import type { MapOptions, TileLayerOptions } from "leaflet";

export const DEFAULT_MAP_OPTIONS: MapOptions = {
  center: [-6.2088, 106.8456],
  zoom: 12,
  zoomControl: false
}

export const DEFAULT_TILE_LAYER_OPTIONS: TileLayerOptions = {
  minZoom: 0,
  maxZoom: 20,
  maxNativeZoom: 19,
  // attribution: '© OpenStreetMap contributors'
};

export const DEFAULT_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';