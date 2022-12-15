/**
 * 上下波动效果
 * data：多边形数据 id：图层id
 */
import * as turf from '@turf/turf'
import {BuildingWave} from '../extension/buildWave'
import { PolygonLayer,GeoJsonLayer } from '@deck.gl/layers'
import { MapboxLayer } from '@deck.gl/mapbox'
import {Deck, WebMercatorViewport } from '@deck.gl/core'
export const waveUp =(map,data,id)=>{
    let box =  getBox(data)
    createBuilding(map,id,box)
}
function getBox(data){
    // var poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
    return turf.transformScale(data, 1.2);
}

// let buildlayer = null
export const createBuilding = (map, id, roomdata) => {

  
  if(map ==null){
    return
  }
  const BUILDING_COLOR = '07848c' //'#02FF02'
  const BUILDING_COLOR_SELECTED = '	#DC143C'
  const BUILDING_COLOR_DACK = '#1BFFFF' // '#016601'
  const ROOM_OPACITY = 100
  const ROOM_LINE_OPACITY = 120//180
  const GROUND_OPACITY =35// 20
  const GROUND_LINE_OPACITY = 120
  const FLOOR_HEIGHT = 20
  const visibleFloor = 0
  const visibleRoom = 0
  
  if (map.getLayer('geojson-layer-build' + id)) {
    map.removeLayer('geojson-layer-build' + id)
    buildlayer =null
    setTimeout(()=>{
      createBuilding(map, id, roomdata) 
    },100)
    
} else{
 let buildlayer = new MapboxLayer({
    id: 'geojson-layer-build' + id,
    type: GeoJsonLayer,
    data: roomdata,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: true,
    wireframe: true,
    // material: {
    //   ambient: 0.35,
    //   diffuse: 0.8,
    //   shininess: 32,
    //   specularColor: [30, 30, 30]
    // },
    autoHighlight: false,
    highlightColor: [0, 180, 0, 200],
    lineWidthScale: 0,
    lineWidthMinPixels: 1,
    u_time:0,
    getFillColor: d => {
      return colorToRGBArray(
        d.properties.selected?BUILDING_COLOR_SELECTED:
          BUILDING_COLOR_DACK, //d.properties.color,
        visibleRoom === 0 ? (d.properties.floor < 0 ? ROOM_OPACITY * 0.5 : ROOM_OPACITY) : d.properties.selected ? ROOM_OPACITY*2 : ROOM_OPACITY * 0.1
      )
    },
    getLineColor: d =>
      colorToRGBArray(
        BUILDING_COLOR_DACK,
        0
      //  d.properties.selected?BUILDING_COLOR_SELECTED: BUILDING_COLOR, //d.properties.color,
        // visibleRoom === 0 ? (d.properties.floor < 0 ? ROOM_LINE_OPACITY * 0.5 : ROOM_LINE_OPACITY) : d.properties.selected ? ROOM_LINE_OPACITY : ROOM_LINE_OPACITY * 0.1
      ),
    getLineWidth: 1,
    opacity: 1,
    updateTriggers: { getFillColor: [visibleRoom] },
    getRadius: 0,
    getElevation: d=>{
      return  d.properties.Height*2.1
    },
    extensions: [new BuildingWave()]
  })
  map.addLayer(buildlayer)
  var time = 0;
  function animate() {
    time = (time + 0.05);
    if(time > 2){
    time = 0;
    }
    
    buildlayer.setProps({ currentTime: time,u_time: time });
    
    requestAnimationFrame(animate);
    }
    
    animate();
}
}



function colorToRGBArray(color, opacity) {
  var c = parseInt(color.replace('#', ''), 16)
  return [Math.floor(c / 65536) % 256, Math.floor(c / 256) % 256, c % 256, opacity ? opacity : 255]
}
