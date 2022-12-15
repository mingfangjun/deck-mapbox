import PipLayer from '../layers/pip-layer/pipLayer'
import { MapboxLayer } from '@deck.gl/mapbox'

export const createPipline = (map,id,pipdata)=>{
    let piplineLayer = new MapboxLayer({
        id: 'pipline' + id,
        type: PipLayer,
        data: pipdata,
        pickable: true,
        getWidth: 5,
        getSourcePosition: d => d.from.coordinates,
        getTargetPosition: d => d.to.coordinates,
        getColor: d => [Math.sqrt(d.inbound + d.outbound), 140, 0]
})
map.addLayer(piplineLayer)
}