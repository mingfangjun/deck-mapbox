import {BuildingFilter} from '../extension/buildFilter'
import { TextLayer, IconLayer, GeoJsonLayer, PolygonLayer } from '@deck.gl/layers'
import { MapboxLayer } from '@deck.gl/mapbox'
import {Deck, WebMercatorViewport } from '@deck.gl/core'
import {FillStyleExtension} from '@deck.gl/extensions';
let buildlayer = null
export const createBuilding = (map, id, roomdata, pingdata,Elevation) => {

  
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
    // if(Elevation>0){
    //   let props = buildlayer.props
    //   roomdata.features.forEach(element => {
    //      element.properties.High =element.properties.High*Elevation
        
    //   });
    //   props.data =  roomdata
    //   buildlayer.setProps(props)
    // }
    // return
    setTimeout(()=>{
      createBuilding(map, id, roomdata, pingdata,Elevation) 
    },100)
    
} else{
  buildlayer = new MapboxLayer({
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
      return  d.properties.Height*(Elevation==null?2:Elevation)
    },
    // extensions: [new BuildingFilter()]

//     fillPatternMask: true,
//     fillPatternAtlas:'./xxx.jpg',// 'https://raw.githubusercontent.com/visgl/deck.gl/master/examples/layer-browser/data/pattern.png',
//     fillPatternMapping: {
// "hatch-1x": {
//   "x": 4,
//   "y": 4,
//   "width": 120,
//   "height": 120,
//   "mask": true
// },
// "hatch-2x": {
//   "x": 132,
//   "y": 4,
//   "width": 120,
//   "height": 120,
//   "mask": true
// },
// "hatch-cross": {
//   "x": 4,
//   "y": 132,
//   "width": 120,
//   "height": 120,
//   "mask": true
// },
// "dots": {
//   "x": 132,
//   "y": 132,
//   "width": 120,
//   "height": 120,
//   "mask": true
// }
// },
//     getFillPattern: (f, {index}) => "hatch-cross",
//     getFillPatternScale: 1/120,
//     getFillPatternOffset: [0, 0],

    // Define extensions
    // extensions: [new FillStyleExtension({pattern: true})]
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
    
    // animate();
}


  // setTimeout(()=>{
  //   let props = buildlayer.props
  //   roomdata.features.forEach(element => {
  //      element.properties.High =element.properties.High*5
      
  //   });
  //   props.data =  roomdata
  //   props.getFillColor = [0, 0, 255]
  //   buildlayer.setProps(props)
  //   map.removeLayer('geojson-layer-build' + 0)
  //   map.addLayer(buildlayer)
  // }
  // ,5000)
 
 if(pingdata==null){
   return
 }

 if (map.getLayer('geojson-layer-ping'+id)) {
  map.removeLayer('geojson-layer-ping'+id)
}
  const pinglayer = new MapboxLayer({
    id: 'geojson-layer-ping'+id,
    type: PolygonLayer,
    data: pingdata.features,
    lineWidthMaxPixels: 1,
    filled: true,
    getPolygon: d => d.geometry.coordinates,
    getFillColor: d => {
      return colorToRGBArray(
        BUILDING_COLOR, //d.properties.color,
        visibleFloor === 0 ? (d.properties.floor < 0 ? GROUND_OPACITY * 0.5 : GROUND_OPACITY) : d.properties.selected ? GROUND_OPACITY : GROUND_OPACITY * 0.1
      )
    },
    getLineColor: d =>
      colorToRGBArray(
        BUILDING_COLOR, //d.properties.color,
        visibleFloor === 0 ? (d.properties.floor < 0 ? GROUND_LINE_OPACITY * 0.5 : GROUND_LINE_OPACITY) : d.properties.selected ? GROUND_LINE_OPACITY : GROUND_LINE_OPACITY * 0.1
      ),
    getLineWidth: 1,
    opacity: 1,
    updateTriggers: { getFillColor: [visibleFloor] }
  })
  map.addLayer(pinglayer)

}
function addEvent(map){
  map.on('click', function (e) {
    let o = pickObject(map, 'geojson-layer-build', e.point)
    if (o) {
      // drawText(map, 'text-wz-select', [o])
      // postMessage(o)
    } else {
      // clearText(map, 'text-wz-select')
    }
     
    // const zoom = e.target.getZoom()
    // e.target.setLayoutProperty('text-layer-wz', 'visibility', zoom >= 19 ? 'visible' : 'none')
    // e.target.setLayoutProperty('icon-layer-wz', 'visibility', zoom >= 18 ? 'visible' : 'none')
  })

  map.on('dblclick', function (e) {
    debugger
    let o = pickObject(map, 'geojson-layer-build', e.point)
    if (o) {
      // drawText(map, 'text-wz-select', [o])
    // layering(map)
    } else {
      // clearText(map, 'text-wz-select')

    }
    let model = pickObject(map, 'custom_layer', e.point)
    debugger
    if (model) {
      // drawText(map, 'text-wz-select', [o])
    } else {
      // clearText(map, 'text-wz-select')

    }

     
    // const zoom = e.target.getZoom()
    // e.target.setLayoutProperty('text-layer-wz', 'visibility', zoom >= 19 ? 'visible' : 'none')
    // e.target.setLayoutProperty('icon-layer-wz', 'visibility', zoom >= 18 ? 'visible' : 'none')
  })
}
function addEffect(layer){
  debugger
  const ambientLight = new Deck.AmbientLight({
    color: [255, 255, 255],
    intensity: 1
  });
  const pointLight1 = new Deck.PointLight({
    color: [255, 128, 0],
    intensity: 1,
    position: [0, 0, 30]
  });
  const pointLight2 = new Deck.PointLight({
    color: [0, 128, 255],
    intensity: 0,
    position: [50, 50, 50]
  });
  const cameraLight = new Deck._CameraLight({
    color: [255, 255, 255],
    intensity: 0.2
  });
  const directionalLight = new Deck.DirectionalLight({
    color: [255, 255, 255],
    direction: [0, 0, -1],
    intensity: 1
  });
  layer.deck.effectManager.setEffects(  new Deck.LightingEffect({ambientLight, pointLight1, pointLight2, cameraLight, directionalLight})
  )
}


function colorToRGBArray(color, opacity) {
  var c = parseInt(color.replace('#', ''), 16)
  return [Math.floor(c / 65536) % 256, Math.floor(c / 256) % 256, c % 256, opacity ? opacity : 255]
}

export function heightLightRoom(map,layer,obj){
  debugger
    let room =obj.properties.name
    obj.properties.selected =true
    let props =layer.implementation.props
    let data = props.data
    data.features.map(item=>{
      return item.properties.name ==room?obj:item
    })
    map.setLayoutProperty('geojson-layer-room0', 'visibility', 'none')
    map.removeLayer('geojson-layer-room0')
    createBuilding(map,0,data,null)
    
}

 function pickObject(map, id, point) {
  let that = this
  const deck = map.__deck
  if (!deck) {
    return
  }
  const { deckPicker, viewManager } = deck

  if (!deckPicker) {
    return
  }

  const viewports = viewManager._viewports,
    { x, y } = point

  viewManager._viewports = [getViewport(deck, map)]

  const info = deck.pickObject({ x, y, layerIds: [id] })

  viewManager._viewports = viewports

  if (info) {
    return info.object
  }
}
function getViewport(deck, map) {
  const center = map.getCenter()

  return new WebMercatorViewport({
    x: 0,
    y: 0,
    width: deck.width,
    height: deck.height,
    longitude: center.lng,
    latitude: center.lat,
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
    nearZMultiplier: 0.02,
    farZMultiplier: 2
  })
}
