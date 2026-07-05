import React, { useEffect, useRef } from 'react';

export default function ShaderBackground({ opacity = 0.6 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl;
    let animationId;
    let isDestroyed = false;

    // Sync drawing-buffer size with CSS client size
    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);
    syncSize();

    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn("WebGL not supported in this browser.");
      return;
    }

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          float ratio = u_resolution.x / u_resolution.y;
          vec2 p = uv;
          p.x *= ratio;
          
          // Ambient color palette
          vec3 color1 = vec3(0.019, 0.078, 0.141); // #051424 base
          vec3 color2 = vec3(0.423, 0.361, 0.906); // #6C5CE7 indigo
          vec3 color3 = vec3(0.294, 0.867, 0.718); // #4BDDB7 teal
          
          // Indigo orb (top leftish)
          vec2 orb1Pos = vec2(0.3 * ratio + sin(u_time * 0.2) * 0.1, 0.7 + cos(u_time * 0.15) * 0.1);
          float dist1 = length(p - orb1Pos);
          float glow1 = smoothstep(0.8, 0.0, dist1);
          
          // Teal orb (bottom rightish)
          vec2 orb2Pos = vec2(0.8 * ratio + cos(u_time * 0.25) * 0.1, 0.3 + sin(u_time * 0.3) * 0.1);
          float dist2 = length(p - orb2Pos);
          float glow2 = smoothstep(0.6, 0.0, dist2);
          
          vec3 finalColor = color1;
          finalColor = mix(finalColor, color2, glow1 * 0.15);
          finalColor = mix(finalColor, color3, glow2 * 0.1);
          
          // Subtle pulse
          finalColor *= 0.9 + 0.1 * sin(u_time * 0.5);
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function compileShader(type, src) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    function render(t) {
      if (isDestroyed) return;
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }

    render(0);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: 'block', width: '100%', height: '100%', opacity }}
    />
  );
}
