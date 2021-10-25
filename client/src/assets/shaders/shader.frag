precision mediump float;

// Uniforms - values that stay the same for every pixel of a single draw call
// Textures - data from pixels
// Varyings - data passed from the vertex shader and interpolated

// v.x === v.s === v.r === v[0]
// v.y === v.t === v.g === v[1]
// v.z === v.p === v.b === v[2]
// v.w === v.q === v.a === v[3]

varying vec2 vTextureCoord; //it's a position of the currently processed pixel (2 dimensional vector of float values)
varying vec4 vColor;

// uniform vec4 dimensions //it's a 4 dimentional vector whose first value is canvas width and the second is canvas height (in pixels)
uniform sampler2D uSampler; //it'a a pixels data of the texture being processed
//input from external
uniform float customUniform;

void main(void)
{
   //[0.0, 0.0] value translates to the [0, 0] pixel of canvas 
   //and the [1.0, 1.0] value translates to the [canvasWidth, canvasHeight]
   vec2 pixelCordinates = vTextureCoord.xy;
   // vec2 pixelSize = vec2(1.0) / dimensions.xy;

   //texture2D function takes the pixels data as the first argument and the pixel coordinates as the second
   vec4 color = texture2D(uSampler, vTextureCoord);

   color.r = pixelCordinates.y + sin(customUniform);
   color.g = pixelCordinates.x + sin(customUniform);
   color.b = 0.0;
   color.a = 0.5;

   //fg.r = clamp(fg.r,0.0,0.9);

   //gl_FragColor sets the color of the current pixel [1.0, 1.0, 1.0, 1.0]
   gl_FragColor = color;
}
