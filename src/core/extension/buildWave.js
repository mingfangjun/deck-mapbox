import { WebMercatorViewport, LayerExtension } from "@deck.gl/core";

class BuildingWave extends LayerExtension {
    getShaders() {
    return {
    inject: {
    //注入顶点着色器声明
    'vs:#decl': `
    varying vec2 vPosition;
    `,
    //注入顶点着色器，对varying变量赋值
    'vs:#main-end': `
    vPosition = vertexPositions ;
    `,
    //注入片元着色器声明
    'fs:#decl': `
    varying vec2 vPosition;
    //uniform vec3 color;
    uniform float u_time;
    `,
    //重写颜色绘制函数
    'fs:DECKGL_FILTER_COLOR': `
    //color = vec4(color.xyz, color.w * pow(vPosition.y,2.0));
    
    vec2 uv =  vPosition;
    float time = u_time * 0.3 + 0.1*0.01;
    // To create the BG pattern
    vec3 wave_color = vec3(0.0);
    // To create the waves
    float wave_width = 0.01;
    uv.y -= 0.8;
    float i = 0.0;
    // for(float i = 0.0; i 0.0 ? sin(i * 2.0 + iTime ) : -sin(i * 2.0 + iTime ){
    // 控制线条运动方式。 sin 内部控制速度 外面控制幅度
    uv.y += sin(i * 2.3 + u_time*0.5 ) * 2.0 ;
    // 控制线条宽度
    //wave_width = abs(1.0 / (400.0 * uv.y));
    wave_width = abs(1.0 / (40.0 * uv.y));  
    wave_color += vec3(wave_width , wave_width * 3.9, wave_width * 4.5);
    // }
    color = vec4(wave_color, vPosition.y >1.1?1.0: ((wave_color.r + wave_color.g + wave_color.b) / 4.0) - 0.2);
    
    //color = vec4(vec3(iTime , 0, 0), 0.5);
    
    `
    }
    
    };
    }
    //传值u_time
    // @ts-ignore
    updateState(params) {
    // @ts-ignore
    const { u_time = 1.0 } = params.props;
    // @ts-ignore
    for (const model of this.getModels()) {
    model.setUniforms({ u_time });
    }
    }
    // @ts-ignore
    getSubLayerProps() {
    // @ts-ignore
    const { u_time = 1.0 } = this.props;
    return {
    u_time
    };
    }
    }
    export { BuildingWave}
    
    