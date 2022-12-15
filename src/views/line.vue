<template>
  <div style="width: 100%; height: 100%">
    <div class="map-container" id="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Deck, WebMercatorViewport } from "@deck.gl/core";
import {
  TextLayer,
  IconLayer,
  GeoJsonLayer,
  PathLayer,
  PolygonLayer,
} from "@deck.gl/layers";
import { MapboxLayer } from "@deck.gl/mapbox";
import {initmap} from '../core/bin/init'
mapboxgl.accessToken =
  "pk.eyJ1IjoibWluZ2ZhbmdqdW4iLCJhIjoiY2t3bjlrZGt3MmpscjJ4bnNoZzN0aWQyeiJ9.Q31o1wkz_qwcR1TYBSqTeQ";
const map = ref(null);

const mapOptions = {
  interactive: true,
  container: "map-container",
  style:"mapbox://styles/mapbox/dark-v9",// "mapbox://styles/mapbox/satellite-streets-v12",// "mapbox://styles/mapbox/dark-v9",
  center:[117.23142451914964, 34.17313106849373],//[113.61233632752317, 34.749278771334176] 中原区,//[117.23142451914964, 34.17313106849373] 卷烟厂,//[111.2663174721078, 34.76125773517248],// [113.61233632752317, 34.749278771334176],
  zoom: 14.362371594010673, // 17,
  maxZoom: 20,
//   pitch: 57.98489841393963, //67,// 0,
//   bearing: -87.17729554647525, // -0.03,
};

const initMaps = () => {
  //   map.on("load", () => {});
};
onMounted(() => {
  map.value = new mapboxgl.Map(mapOptions);
  map.value.on("load", () => {
    // map.value.addSource("mapbox-dem", {
    //   type: "vector",
    //   url: "mapbox://mapbox.mapbox-terrain-v2",
    // //   tileSize: 512,
    // //   maxzoom: 14,
    // });
  //     map.value.addLayer({
  //     id:'tinting-layer',
  //     'source': 'mapbox-dem',
  //     'source-layer': 'contour',
  //     'type': 'fill-extrusion',
  //     paint:{
  //         "fill-extrusion-color":[
  //             "interpolate",
  //             ["linear"],
  //             ["get", "ele"],
  //             -410,
  //             "hsl(253, 98%, 42%)",
  //             0,
  //             "hsl(237, 94%, 49%)",
  //             1000,
  //             "hsl(213, 96%, 64%)",
  //             2000,
  //             "hsl(177, 100%, 50%)",
  //             3000,
  //             "hsl(119, 100%, 53%)",
  //             4000,
  //             "hsl(98, 98%, 69%)",
  //             5000,
  //             "hsl(69, 95%, 56%)",
  //             6000,
  //             "hsl(27, 95%, 56%)",
  //             7000,
  //             "hsl(0, 96%, 64%)"
  //           ],
  //         "fill-extrusion-height":[
  //             "interpolate",
  //             ["linear"],
  //             ["get", "ele"],
  //             0,
  //             0,
  //             8840,
  //             8840
  //         ]
  //     }
  // })
    // add the DEM source as a terrain layer with exaggerated height
    // map.value.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
    initmap(map.value)
  });
});
</script>

<style lang="scss" scoped>
#map-container {
  width: 100%;
  height: 100%;
}
</style>