// @ts-nocheck

import geojsonvt from "geojson-vt";
import L from "leaflet"

L.GeoJSON.VT = L.GridLayer.extend({
  options: {
    async: false,
  },

  initialize: function (geojson, options) {
    L.setOptions(this, options);
    L.GridLayer.prototype.initialize.call(this, options);
    this.tileIndex = geojsonvt(geojson, this.options);
  },

  createTile: function (coords) {
    // create a <canvas> element for drawing
    // setup tile width and height according to the options
    const tile = L.DomUtil.create("canvas", "leaflet-tile");
    const size = this.getTileSize();
    tile.width = size.x;
    tile.height = size.y;
    // get a canvas context and draw something on it using coords.x, coords.y and coords.z
    const ctx = tile.getContext("2d");
    // return the tile so it can be rendered on screen
    const tileInfo = this.tileIndex.getTile(coords.z, coords.x, coords.y);
    const features = tileInfo ? tileInfo.features : [];
    for (let i = 0; i < features.length; i++) {
      this.drawFeature(ctx, features[i]);
    }
    return tile;
  },

  drawFeature: function (ctx, feature) {
    const { type } = feature;

    ctx.beginPath();
    if (this.options.style) {
      if (this.options.style instanceof Function) {
        this.setStyle(ctx, this.options.style(feature.tags))
      }
      else {
        this.setStyle(ctx, this.options.style);
      }
    }

    if (type === 1) {
      for (let j = 0; j < feature.geometry.length; j++) {
        const p = feature.geometry[j];
        ctx.arc(p[0] / 16.0, p[1] / 16.0, 2, 0, Math.PI * 2, true);
      }
    }
    else if (type === 2 || type === 3) {
      for (let j = 0; j < feature.geometry.length; j++) {
        const ring = feature.geometry[j];
        for (let k = 0; k < ring.length; k++) {
          const p = ring[k];
          if (k) ctx.lineTo(p[0] / 16.0, p[1] / 16.0);
          else ctx.moveTo(p[0] / 16.0, p[1] / 16.0);
        }
      }
    }

    if (type === 3) ctx.fill(this.options.style.fillRule || "evenodd");

    ctx.stroke();
  },

  setStyle: function (ctx, style) {
    ctx.lineWidth = style.weight || 5;
    ctx.strokeStyle = this.setOpacity(style.color, style.opacity);
    ctx.lineWidth = 0;
    ctx.strokeStyle = {};

    ctx.fillStyle = style.fillColor || "#03f";
    ctx.fillStyle = this.setOpacity(style.fillColor, style.fillOpacity);
  },

  setOpacity: function (color, opacity) {
    if (!opacity || !iscolorHex(color)) return color
    const [r, g, b] = toColorRgb(color);
    return `rgba(${r},${g},${b},${opacity})`
  },
});

export function vt(geojson, options) {
  return new L.GeoJSON.VT(geojson, options)
}

function iscolorHex(color: String) {
  const sColor = color.toLowerCase();
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  return reg.test(sColor);
};

function toColorRgb(color: String) {
  let sColor = color.toLowerCase();
  if (sColor.length === 4) {
    let sColorNew = "#";
    for (let i = 1; i < 4; i += 1) {
      sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
    }
    sColor = sColorNew;
  }
  const sColorChange = [];
  for (let i = 1; i < 7; i += 2) {
    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
  }
  return sColorChange;
};