const vertex = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0,1);}`;

const fragment = `#version 300 es
precision highp float;
uniform sampler2D density;
uniform vec2 grid;
uniform vec2 origin;
uniform float dpr;
uniform float bayer[64];
uniform vec3 pixelColor;
out vec4 color;

void main(){
  vec2 pixel = gl_FragCoord.xy / dpr;
  ivec2 q = ivec2(floor((pixel - origin) / 25.));
  float ink = 0.;
  if(all(greaterThanEqual(q, ivec2(0))) && all(lessThan(q, ivec2(grid)))) {
    ink = texelFetch(density, q, 0).r;
  }
  ivec2 dotPixel = ivec2(floor(pixel / 2.)) % 8;
  float threshold = min(bayer[dotPixel.y * 8 + dotPixel.x], .99999);
  
  // When ink > threshold: draw pixelColor; when ink <= threshold: draw pure white (vec3(1.0))
  color = vec4(mix(pixelColor, vec3(1.0), step(ink, threshold)), 1.0);
}`;

export function createPixelRenderer(canvas, meta) {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
    powerPreference: 'low-power'
  });
  if (!gl) return canvasRenderer(canvas, meta);

  const shaders = [];
  const compile = (type, text) => {
    const shader = gl.createShader(type);
    shaders.push(shader);
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  gl.disable(gl.DITHER);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.NEAREST);
  for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);

  gl.uniform1i(gl.getUniformLocation(program, 'density'), 0);
  gl.uniform1fv(gl.getUniformLocation(program, 'bayer[0]'), meta.bayer.flat());

  const grid = gl.getUniformLocation(program, 'grid');
  const origin = gl.getUniformLocation(program, 'origin');
  const pixelRatio = gl.getUniformLocation(program, 'dpr');
  const pixelColorLoc = gl.getUniformLocation(program, 'pixelColor');

  let cols = 0, rows = 0;

  return {
    kind: 'webgl2',
    draw(engine, rgb = [0.05, 0.28, 0.22]) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(engine.width * dpr), h = Math.round(engine.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.useProgram(program);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      if (cols !== engine.cols || rows !== engine.rows) {
        cols = engine.cols;
        rows = engine.rows;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, cols, rows, 0, gl.RED, gl.FLOAT, engine.ink);
      } else {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, cols, rows, gl.RED, gl.FLOAT, engine.ink);
      }

      gl.uniform2f(grid, cols, rows);
      gl.uniform2f(origin, engine.ox, engine.oy);
      gl.uniform1f(pixelRatio, dpr);
      gl.uniform3f(pixelColorLoc, rgb[0], rgb[1], rgb[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      shaders.forEach(s => gl.deleteShader(s));
    }
  };
}

function canvasRenderer(canvas, meta) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas rendering unavailable');
  let image;

  return {
    kind: 'canvas2d',
    draw(engine, rgb = [0.05, 0.28, 0.22]) {
      const w = Math.round(engine.width);
      const h = Math.round(engine.height);
      if (canvas.width !== w || canvas.height !== h || !image) {
        canvas.width = w;
        canvas.height = h;
        image = ctx.createImageData(w, h);
      }
      const pixels = image.data;
      const rVal = Math.round(rgb[0] * 255);
      const gVal = Math.round(rgb[1] * 255);
      const bVal = Math.round(rgb[2] * 255);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const by = h - y - 0.5;
          const qx = Math.floor((x + 0.5 - engine.ox) / 25);
          const qy = Math.floor((by - engine.oy) / 25);
          const k = engine.index(qx, qy);
          const ink = k >= 0 ? engine.ink[k] : 0;
          const threshold = Math.min(meta.bayer[Math.floor(by / 2) % 8][Math.floor((x + 0.5) / 2) % 8], 0.99999);
          const p = (y * w + x) * 4;
          const isInk = ink > threshold;

          pixels[p] = isInk ? rVal : 255;
          pixels[p + 1] = isInk ? gVal : 255;
          pixels[p + 2] = isInk ? bVal : 255;
          pixels[p + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    },
    dispose() {}
  };
}
