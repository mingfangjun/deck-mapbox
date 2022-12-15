import build from '../../assets/staic/building_12.json'
import line from '../../assets/staic/line.json'
// import zyq from '../../assets/staic/zyqqybm4.json'
import { waveUp } from '../animation/waveUp'
import { createBuilding } from '../layers/createBuilding'
import { lineArrow } from '../layers/lineArrow'
import { createPipline } from '../work/createPipline'
export const initmap =(map)=>{
    createBuilding(map,0,build)
    // lineArrow(map,line.features)
    // waveUp(map,build.features[3],"wave0")
    // waveUp(map,build.features[5],"wave")
    // waveUp(map,build.features[10],"wave1")

    /** test .......... */
    createPipline(map,0,[
           {
            inbound: 72633,
            outbound: 74735,
            from: {
               name: '19th St. Oakland (19TH)',
               coordinates: [117.24428515547025,
                34.1683120528824]
             },
            to: {
              name: '12th St. Oakland City Center (12TH)',
           coordinates: [ 117.22781076857628,
            34.16789570751071]
           }}
        
         ])
}