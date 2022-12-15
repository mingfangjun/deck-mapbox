const init =()=>{
    let vec4=[[],[],[],[]] //四点坐标
    let data = getGridArry(vec4,10)
    addGrid2map(map,data)
}
/**
 * 
 * @param {*} vec4 四个点坐标  [a,b,c,d]
 *  a  b
 *  c  d  四个点 例如a:[0,0]
 *  n分割的比例
 * @returns 
 */
const getGridArry =(vec4,n)=>{
      //获取 a  b c d
      let x = (b[0]-a[0])/n 
      let y =(d[0]-c[0])/n 
      let data =[]
      for(let i = 0;i<n;i++){
        for(let j =0;j<n;j++){
            let grid_c =[c[0]+x*i,c[1]+j*i] //算一下
            let grid_d =[c[0]+x*(i+1),c[1]+j*i] 
            let grid_a =[c[0]+x*i,c[1]+j*(i+1)] 
            let grid_b =[c[0]+x*(i+1),c[1]+j*(i+1)] 
            data.push([grid_a,grid_b,grid_c,grid_d])
        }
      }
      return  data
}
const addGrid2map = (map,grid)=>{
    const grid = new MapboxLayer({
        id: 'grid-layer',
        type: PolygonLayer,
        data: pingdata.features,
        lineWidthMaxPixels: 1,
        filled: true,
        getPolygon: d => d,
        getFillColor: d => {
          return colorToRGBArray(
            BUILDING_COLOR, //d.properties.color,
          )
        },
        getLineColor: d =>
          colorToRGBArray(
            BUILDING_COLOR, //d.properties.color,
          ),
        getLineWidth: 1,
        opacity: 1,
        updateTriggers: { getFillColor: [visibleFloor] }
      })
      map.addLayer(grid)

}
