import * as turf from '@turf/turf'
import { IconLayer,PathLayer,PolygonLayer} from '@deck.gl/layers'
import { MapboxLayer } from '@deck.gl/mapbox'
import {DataFilterExtension} from '@deck.gl/extensions'

// var icon = require('../../../public/arrow.png')
export const lineArrow =(map,line)=>{
    debugger
      addline(map,line)
    //   addMarker(map,line)
    debugger
      addArrow(map,line)
}
function addMarker(map,line){
   let data = interpolation(line)
   addIcons(map,data)
}
function addArrow(map,line){
    let data = interpolation(line)
    let arrowdata =[]
    for(let i =0;i<data.length-1;i++){
        let arrow = getArrowData([data[i],data[i+1]],"more")
        for(let j =0;j<arrow.length;j++){
          arrowdata.push({
            position:arrow[j],
                time:i
          })
        }
    }
    doaddArrow(map,"arrow-ploy",arrowdata)
}

function getArrowData(points,type){
    let first = points[0] //前一个点
    let second = points[1] //后一个点
    var bearing =  turf.rhumbBearing(turf.point(second, {"marker-color": "F00"}),turf.point(first, {"marker-color": "F00"})) //北方向角度

    var pt = turf.point(second, {"marker-color": "F00"})
    var distance = 0.006;
    var bearing_ = 45;
    var options = {units: 'miles'};
    console.log(bearing)
    function handleBearing(bearing){
       if(bearing>180){
         return bearing-360
       }
       if(bearing<-180){
         return bearing+360
       }
       return bearing
    }
    function handleBearing2(bearing){
       if(bearing>=0){
        return -180+bearing
       }else{
         return bearing+180
       }
    }
    var destination_left = turf.rhumbDestination(pt, distance,handleBearing(bearing+bearing_) , options);
    var destination_right = turf.rhumbDestination(pt, distance,handleBearing(bearing-bearing_) , options);
    var destination_bottom = turf.rhumbDestination(pt, distance/2, handleBearing2(bearing), options);
    let result =[]
    result.push([second,destination_left.geometry.coordinates,destination_bottom.geometry.coordinates,destination_right.geometry.coordinates])
    if(type =='more'){
      var bearing_ = 45;
      var options = {units: 'miles'};
      var distance_more = 0.006
      var bearing_more = handleBearing2(bearing) 
      
      var destination_start = turf.rhumbDestination(pt, distance_more, bearing_more, options);
      var start = turf.point(destination_start.geometry.coordinates, {"marker-color": "F00"})
      var destination_left_1 = turf.rhumbDestination(start, distance/2, handleBearing(bearing+bearing_), options);
      var destination_right_1 = turf.rhumbDestination(start, distance/2, handleBearing(bearing-bearing_), options);
      var destination_bottom_1 = turf.rhumbDestination(start, distance/4,  handleBearing2(bearing), options);
      result.push([destination_start.geometry.coordinates,destination_left_1.geometry.coordinates,destination_bottom_1.geometry.coordinates,destination_right_1.geometry.coordinates])

    }
    return result
}
function interpolation(line){
    // var line = turf.lineString([
    //     [109.502991, 29.68718],
    //     [108.837829, 32.969237],
    //     [113.567871, 37.200787]
    //   ]);
var options = {units: 'miles'};
var length =  turf.length(line[0], {units: 'miles'})
var  l =0.03
var n = length/l
var data = []
for(let i = 0;i<n;i++){
    let along = turf.along(line[0], l*i, options);
     data.push(along.geometry.coordinates)
}
console.log(data)
return data
}
function addline(map,data){
    if (!map.getLayer('trips-layer')) {
        let layer = new MapboxLayer({
          id: 'trips-layer',
          type: PathLayer,
          data:data,
          pickable: true,
          widthScale: 16,
          widthMinPixels: 2,
          greatCircle:true,
          getHeight:0.05,
          getPath: (d) => d.geometry.coordinates,
          getColor: (d) => colorToRGBArray("#f6c500",255/2),
          getWidth: (d) => 1,
          onHover: (info, event) => {}
        })
        // map.addLayer(layer)
       
        map.addLayer(layer)
}
}
function addIcons(map, data) {
    let that = this
    const ICON_MAPPING = {
      marker: { x: 0, y: 0, width: 128, height: 128, mask: true }
    }
    if (!map.getLayer('icon-layer-camera')) {
      const iconLayer = new MapboxLayer({
        id: 'icon-layer-camera',
        type: IconLayer,
        data: data, 
        pickable: true,
        // iconAtlas: that.icon_camera, // "/images/icon-atlas.png",
        // iconMapping: ICON_MAPPING,
        // getIcon: (d) => 'marker',
        // sizeMaxPixels: 50,
        // sizeScale: 12,
        getIcon: d => ({
          url: '../../../public/arrow.png',
          width: 32,
          height: 32,
          anchorY: 0
        }), // (d) => 'marker',
        sizeMaxPixels: 125,
        sizeScale: 1,
        getSize: d => 32,
        getColor: d => {
          return colorToRGBArray('#76ff03')
        },
        getPosition: (d) => d,
        getSize: (d) =>32,
        getColor: (d) => {
          return '#e30f53'
        },
        parameters: {
          depthTest: false
        },
        opacity: 1,
        onHover: (info, event) => {
          if (info.picked) {
            map.getCanvas().style.cursor = 'pointer'
          } else {
            map.getCanvas().style.cursor = ''
          }
          if (info.object && map.getZoom() >= 10) {
          }
        },
        onClick: (info, event) => {
          if (info.object) {
            console.log(info.object)
          }
        }
      })
      map.addLayer(iconLayer)
    }
  }
  var buildlayer =null

 
  export const doaddArrow = (map, id, roomdata) => {
    var isPlaying = true;
    var filterMin = 0;
    const filterSpan = 1000;
    const maxTime = roomdata[roomdata.length - 1].time;
    let time = 0
    function redraw() {
      time = time+1;   //15m/s  0.015km/s   0.015/60 每帧  30*60
      const speed = 0.5
      console.log("time",time)
       if (time >= 250) {
         time = 0; 
       }
       let data = []
       for(let i =0;i<roomdata.length;i++){
         if(i<=speed*time){
           data.push( {
             position:roomdata[i].position
           })
         }
       }
       if(data.length>=2){
        data[data.length-1].first = true
        data[data.length-2].first = true
       }

       console.log(data.length)
        buildlayer.setProps({
          data: data
          // filterRange:[maxTime+1,(time/(16*3))*maxTime]
        })
        requestAnimationFrame(redraw)
        
    }
    if(map ==null){
      return
    }
    const BUILDING_COLOR ='#ffb515'// '#07848c' //'#02FF02'
    const BUILDING_COLOR_FIRST = "#DC143C"
    const BUILDING_COLOR_SELECTED = '	#DC143C'
    const BUILDING_COLOR_DACK = '#1BFFFF' // '#016601'
    const ROOM_OPACITY = 100
    const ROOM_LINE_OPACITY = 120//180
    const GROUND_OPACITY =150// 35*3// 20
    const GROUND_LINE_OPACITY = 120
    const FLOOR_HEIGHT = 20
    const visibleFloor = 0
    const visibleRoom = 0
    
    if (map.getLayer( id)) {
      map.removeLayer(id)
      buildlayer =null
      setTimeout(()=>{
        doaddArrow(map, id, roomdata) 
      },100)
      
  } else{
    buildlayer = new MapboxLayer({
        id:id,
        type: PolygonLayer,
        data: roomdata,
        lineWidthMaxPixels: 1,
        filled: true,
        extruded: true,
        getPolygon: d => d.position,
        getFillColor: d => {
          return colorToRGBArray(
            d.first?BUILDING_COLOR_FIRST: BUILDING_COLOR, //d.properties.color,
            255*0.6// GROUND_OPACITY
          )
        },
        getLineColor: d =>
          colorToRGBArray(
            d.first?BUILDING_COLOR_FIRST: BUILDING_COLOR, //d.properties.color,
             255*0.4// ROUND_LINE_OPACITY
          ),
        getLineWidth: 1,
        opacity: 1,
        updateTriggers: { getFillColor: [visibleFloor] },
        getElevation: d=>{
          return   3  //20//
        },
        // getFilterValue: d => d.time,
        // filterRange:[-filterMin, -filterMin + filterSpan],// [filterMin, filterMin + filterSpan],
        // filterSoftRange: [filterMin + filterSpan * 0.8, filterMin + filterSpan],
        // filterTransformSize: true,
        // filterTransformColor: true,
        // filterEnabled: true,
  
        // extensions: [new DataFilterExtension({filterSize: 1})]
    })
    map.addLayer(buildlayer,"trips-layer")
    if (isPlaying) {
      redraw()
        // requestAnimationFrame(redraw);
      }
  }
  }

  function colorToRGBArray(color, opacity) {
    var c = parseInt(color.replace('#', ''), 16)
    return [Math.floor(c / 65536) % 256, Math.floor(c / 256) % 256, c % 256, opacity ? opacity : 255]
  }
  