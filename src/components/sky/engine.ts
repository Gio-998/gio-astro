/**
 * Living Sky: one full-screen fragment shader (aurora curtains + fbm nebula + procedural stars).
 * Raw WebGL (1 or 2), a single triangle, no libraries. Reacts to pointer, device tilt and scroll;
 * tinted by the user's palette (CSS variables) or a palette pushed through lib/sky-bus.
 */
import { getSky, onSky } from "@/lib/sky-bus";
import { saveTier, userTier, type Tier } from "@/lib/device-tier";

const VERT = `attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.,1.);}`;
const frag = (oct: number) => `precision mediump float;
#define OCT ${oct}
uniform vec2 uRes;uniform float uPx;uniform float uTime;uniform vec3 uA;uniform vec3 uB;uniform vec3 uC;
uniform vec2 uPtr;uniform float uPtrS;uniform vec2 uTilt;uniform float uInt;uniform float uSwirl;uniform float uScroll;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<OCT;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
float stars(vec2 px,float cell,float th,float t){vec2 g=px/cell;vec2 id=floor(g);vec2 f=fract(g)-.5;float h=hash(id);
float on=step(th,h);vec2 o=vec2(hash(id+3.1),hash(id+7.7))-.5;float d=length((f-o*.7)*cell);
float tw=.55+.45*sin(t*(.8+h*2.6)+h*40.);return on*smoothstep(1.6+h*.9,0.,d)*tw;}
void main(){
vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 p=(uv-.5)*vec2(asp,1.);
vec2 pp=(uPtr-.5)*vec2(asp,1.);vec2 d=p-pp;float dl=length(d);
p-=d*uPtrS*.28*exp(-dl*dl*7.);
float r=length(p);float an=uSwirl*3.*exp(-r*1.6);float cs=cos(an),sn=sin(an);p=mat2(cs,-sn,sn,cs)*p;
float t=uTime*.035;vec2 q=p*1.35+uTilt*.07;
float n=fbm(q*1.15+vec2(t,-t*.6)+fbm(q*2.1-t)*.85);
float band=p.y*.85+p.x*.5+.08-uScroll*.22;
float wave=sin(p.x*2.1+t*5.+n*3.)*.11+fbm(vec2(p.x*1.4+t*2.,t*.7))*.24;
float a1=exp(-pow((band-wave)*3.1,2.));float a2=exp(-pow((band-wave+.42)*4.2,2.));
float stri=.55+.45*noise(vec2(p.x*13.+n*4.,t*3.));
vec3 col=mix(vec3(.047,.039,.13),vec3(.105,.082,.255),uv.y);
col+=uA*n*n*.62*uInt;
col+=mix(uB,uA,clamp(uv.x+n*.3,0.,1.))*a1*stri*.5*uInt;
col+=uC*a2*stri*.34*uInt;
col+=vec3(1.,.84,.72)*.05*smoothstep(.55,0.,uv.y);
vec2 px=gl_FragCoord.xy/uPx;
float s=stars(px+uTilt*6.+uPtr*4.,18.,.93,uTime)+.8*stars(px*1.+uTilt*16.+vec2(uTime*1.5,0.),34.,.9,uTime*1.3);
col+=vec3(1.,.96,.9)*s*(1.-a1*.4)*.95;
col+=uC*.22*uPtrS*exp(-dl*dl*28.);
col*=1.-.32*pow(length(uv-.5)*1.25,2.);
gl_FragColor=vec4(col,1.);}`;

const hex = (h: string, fb: number[]): number[] => {
  const m = /^#?([0-9a-f]{6})$/i.exec(h.trim()); if (!m) return fb;
  const n = parseInt(m[1], 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const HOUSE = { a: "#8b6cf0", b: "#5ee6d0", c: "#ff8fc7" };

function palette(): number[][] {
  const o = getSky().palette;
  if (o) return o.map((c, i) => hex(c, hex(Object.values(HOUSE)[i], [1, 1, 1])));
  const root = document.documentElement; const cs = getComputedStyle(root);
  if (!root.dataset.theme) return [hex(HOUSE.a, []), hex(HOUSE.b, []), hex(HOUSE.c, [])];
  return [hex(cs.getPropertyValue("--color-violet"), hex(HOUSE.a, [])), hex(cs.getPropertyValue("--personal-accent"), hex(HOUSE.b, [])), hex(cs.getPropertyValue("--color-rose"), hex(HOUSE.c, []))];
}

export interface SkyHandle { stop(): void }

export function startSky(canvas: HTMLCanvasElement, tier: Tier, opts: { reduced: boolean; onTier: (t: Tier) => void }): SkyHandle | null {
  const gl = (canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "low-power"}) ||
    canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power"})) as WebGLRenderingContext | null;
  if (!gl) return null;
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag(tier === "full" ? 5 : 3)));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = { res: U("uRes"), px: U("uPx"), time: U("uTime"), a: U("uA"), b: U("uB"), c: U("uC"), ptr: U("uPtr"), ptrS: U("uPtrS"), tilt: U("uTilt"), int: U("uInt"), swirl: U("uSwirl"), scroll: U("uScroll") };

  const scale = tier === "full" ? Math.min(window.devicePixelRatio || 1, 2) * 0.5 : 0.42;
  let W = 0, H = 0;
  const resize = () => {
    const w = Math.max(1, Math.round(window.innerWidth * scale)), h = Math.max(1, Math.round(window.innerHeight * scale));
    if (w === W && h === H) return; W = w; H = h; canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
  };
  resize();

  // live values (lerped toward targets every frame)
  let pal = palette(); const cur = pal.map((c) => [...c]);
  const ptr = { x: 0.5, y: 0.62, tx: 0.5, ty: 0.62, s: 0, ts: 0 };
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  let scroll = 0, intensity = getSky().intensity, swirl = getSky().swirl;
  let lastInteract = 0; let touchedOnce = false;

  const onMove = (e: PointerEvent) => {
    ptr.tx = e.clientX / window.innerWidth; ptr.ty = 1 - e.clientY / window.innerHeight;
    ptr.ts = e.pointerType === "mouse" ? 0.45 : (e.buttons || e.type === "pointerdown" ? 1 : ptr.ts);
    lastInteract = performance.now(); wake();
  };
  const onDown = (e: PointerEvent) => { onMove(e); ptr.ts = 1; if (!touchedOnce && e.pointerType === "touch") { touchedOnce = true; try { navigator.vibrate?.(8); } catch { /* */ } } };
  const onUp = () => { ptr.ts = 0; };
  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    tilt.tx = Math.max(-1, Math.min(1, e.gamma / 30)); tilt.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    lastInteract = performance.now(); wake();
  };
  const onScroll = () => { lastInteract = performance.now(); wake(); };
  const refreshPal = () => { pal = palette(); wake(); };
  const mo = new MutationObserver(refreshPal);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style"] });
  const offBus = onSky((s) => { pal = palette(); intensity = s.intensity; swirl = s.swirl; wake(); });

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("pointercancel", onUp, { passive: true });
  window.addEventListener("deviceorientation", onOrient, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", resize);

  let raf = 0, running = true, last = 0, lastDraw = 0; const t0 = performance.now();
  let uI = intensity, uS = swirl;
  const deltas: number[] = []; let watching = !opts.reduced && !userTier(); let curTier = tier;

  const draw = (now: number) => {
    const dt = Math.min(0.1, (now - (last || now)) / 1000); last = now;
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent smoothing
    ptr.x += (ptr.tx - ptr.x) * k * 0.6; ptr.y += (ptr.ty - ptr.y) * k * 0.6; ptr.s += (ptr.ts - ptr.s) * k * 0.5;
    tilt.x += (tilt.tx - tilt.x) * k * 0.4; tilt.y += (tilt.ty - tilt.y) * k * 0.4;
    const sc = Math.min(3, window.scrollY / Math.max(1, window.innerHeight)); scroll += (sc - scroll) * k * 0.5;
    uI += (intensity - uI) * k * 0.4; uS += (swirl - uS) * k * 0.5;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cur[i][j] += ((pal[i]?.[j] ?? 1) - cur[i][j]) * k * 0.3;
    gl.uniform2f(u.res, W, H); gl.uniform1f(u.px, scale); gl.uniform1f(u.time, opts.reduced ? 40 : (now - t0) / 1000);
    gl.uniform3fv(u.a, cur[0]); gl.uniform3fv(u.b, cur[1]); gl.uniform3fv(u.c, cur[2]);
    gl.uniform2f(u.ptr, ptr.x, ptr.y); gl.uniform1f(u.ptrS, opts.reduced ? 0 : ptr.s); gl.uniform2f(u.tilt, opts.reduced ? 0 : tilt.x, opts.reduced ? 0 : tilt.y);
    gl.uniform1f(u.int, uI); gl.uniform1f(u.swirl, uS); gl.uniform1f(u.scroll, opts.reduced ? 0 : scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    lastDraw = now;
  };

  const loop = (now: number) => {
    if (!running) return;
    if (watching) {
      // skip the first 1.5s (hydration, fonts, images) so page work isn't blamed on the sky
      if (last && now - t0 > 1500 && !document.hidden) deltas.push(now - last);
      if (now - t0 > 5000 && deltas.length > 30) {
        watching = false;
        const med = [...deltas].sort((a, b) => a - b)[deltas.length >> 1];
        if (med > (curTier === "full" ? 34 : 48)) { // can't hold ~30fps (lite: ~20fps): step down a tier and remember it
          const next: Tier = curTier === "full" ? "lite" : "off"; saveTier(next); curTier = next; opts.onTier(next); return;
        }
      }
    }
    const idle = now - lastInteract > 1200;
    // 60fps while touched/scrolled/tilted, ~30fps ambient (lite: always ~30fps)
    const minGap = watching ? 0 : (curTier === "full" && !idle ? 0 : 31);
    if (now - lastDraw >= minGap) draw(now);
    raf = requestAnimationFrame(loop);
  };
  const wake = () => { if (opts.reduced && running) { requestAnimationFrame(draw); } };
  const onVis = () => { if (document.hidden) { cancelAnimationFrame(raf); } else if (running && !opts.reduced) { last = 0; raf = requestAnimationFrame(loop); } };
  document.addEventListener("visibilitychange", onVis);
  const onLost = (e: Event) => { e.preventDefault(); opts.onTier("off"); };
  canvas.addEventListener("webglcontextlost", onLost);

  if (opts.reduced) requestAnimationFrame(draw); else raf = requestAnimationFrame(loop);

  return {
    stop() {
      running = false; cancelAnimationFrame(raf); mo.disconnect(); offBus();
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("deviceorientation", onOrient); window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
    },
  };
}

/**
 * Render one still frame of the sky at any size on a throwaway canvas (share cards: 1080x1920).
 * Works even when the live background is off. Returns null without WebGL.
 */
export function renderSkyStill(w: number, h: number, colors: string[], seed = 0, focus: [number, number] = [0.5, 0.62]): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
  const gl = (canvas.getContext("webgl2", { preserveDrawingBuffer: true }) || canvas.getContext("webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
  if (!gl) return null;
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag(5))); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog); gl.viewport(0, 0, w, h);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const pal = [0, 1, 2].map((i) => hex(colors[i] ?? "", hex(Object.values(HOUSE)[i], [1, 1, 1])));
  gl.uniform2f(U("uRes"), w, h); gl.uniform1f(U("uPx"), w / 420); gl.uniform1f(U("uTime"), 30 + (seed % 997) * 0.37);
  gl.uniform3fv(U("uA"), pal[0]); gl.uniform3fv(U("uB"), pal[1]); gl.uniform3fv(U("uC"), pal[2]);
  gl.uniform2f(U("uPtr"), focus[0], focus[1]); gl.uniform1f(U("uPtrS"), 0.5); gl.uniform2f(U("uTilt"), 0, 0);
  gl.uniform1f(U("uInt"), 1.15); gl.uniform1f(U("uSwirl"), 0.15); gl.uniform1f(U("uScroll"), 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  return canvas;
}
