// Hero 3D scene: a glossy spinning vinyl record wrapped in a ring of equalizer bars,
// floating over a rippling "sound wave" particle field. Loaded lazily (separate chunk).
import {
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Float32BufferAttribute,
  BufferGeometry,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  ACESFilmicToneMapping,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from 'three'
import { createDotTexture, createLabelTexture, createVinylTextures } from './heroTextures'

// Brand palette
const ACCENT = 0xbe9c79
const EMBER = 0xa84c00
const BROWN = 0x410e01
const DARK = 0x101311
const ICE = 0xd5e1ef

const TAU = Math.PI * 2

const WAVE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec2 uMouse;
  attribute float aRand;
  varying float vElev;
  varying float vFade;

  void main() {
    vec3 p = position;
    vec2 origin = vec2(uMouse.x * 2.5, -1.5 + uMouse.y * 0.8);
    float d = distance(p.xz, origin);
    float ripple = sin(d * 2.4 - uTime * 2.2) * 0.16 * exp(-d * 0.22);
    float swell = sin(p.x * 0.55 + uTime * 0.8) * 0.2
      + sin(p.z * 0.9 - uTime * 1.25 + p.x * 0.25) * 0.1;
    float e = ripple + swell;
    p.y += e;
    vElev = e;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.7 + aRand * 0.6) / -mv.z;

    float depthFade = smoothstep(-9.0, -3.5, position.z) * (1.0 - smoothstep(1.0, 3.0, position.z));
    float sideFade = 1.0 - smoothstep(6.0, 9.0, abs(position.x));
    vFade = depthFade * sideFade;
  }
`

const WAVE_FRAGMENT = /* glsl */ `
  uniform vec3 uColorLow;
  uniform vec3 uColorHigh;
  uniform float uOpacity;
  varying float vElev;
  varying float vFade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.05, r);
    float h = smoothstep(-0.3, 0.35, vElev);
    vec3 col = mix(uColorLow, uColorHigh, h);
    gl_FragColor = vec4(col, soft * vFade * uOpacity * (0.25 + 0.75 * h));
    #include <colorspace_fragment>
  }
`

/** Warm studio environment used only for reflections on the glossy record. */
function createEnvironment(renderer) {
  const envScene = new Scene()
  const room = new Mesh(
    new BoxGeometry(20, 20, 20),
    new MeshBasicMaterial({ color: DARK, side: BackSide }),
  )
  envScene.add(room)

  const panels = [
    {
      color: new Color(ACCENT).multiplyScalar(6),
      size: [10, 2],
      pos: [-4, 8, 2],
      rot: [Math.PI / 2, 0, 0.4],
    },
    {
      color: new Color(EMBER).multiplyScalar(5),
      size: [2, 8],
      pos: [9, 1, -2],
      rot: [0, -Math.PI / 2, 0],
    },
    {
      color: new Color(ICE).multiplyScalar(1.2),
      size: [6, 3],
      pos: [-9, 2, -4],
      rot: [0, Math.PI / 2, 0],
    },
    {
      color: new Color(ACCENT).multiplyScalar(2.5),
      size: [4, 4],
      pos: [0, 2, 9],
      rot: [0, Math.PI, 0],
    },
  ]
  for (const p of panels) {
    const mesh = new Mesh(
      new PlaneGeometry(...p.size),
      new MeshBasicMaterial({ color: p.color, side: DoubleSide }),
    )
    mesh.position.set(...p.pos)
    mesh.rotation.set(...p.rot)
    envScene.add(mesh)
  }

  const pmrem = new PMREMGenerator(renderer)
  const target = pmrem.fromScene(envScene, 0.035)
  pmrem.dispose()
  envScene.traverse((obj) => {
    if (obj.isMesh) {
      obj.geometry.dispose()
      obj.material.dispose()
    }
  })
  return target
}

function createRecord(lite, maxAnisotropy) {
  const record = new Group()
  const spinner = new Group()
  record.add(spinner)

  const thickness = 0.035
  const vinyl = createVinylTextures(lite ? 512 : 1024, maxAnisotropy)
  const topMaterial = new MeshPhysicalMaterial({
    color: 0xffffff,
    map: vinyl.map,
    roughness: 1,
    roughnessMap: vinyl.roughnessMap,
    metalness: 0.15,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
    anisotropy: 0.85,
    anisotropyMap: vinyl.anisotropyMap,
    envMapIntensity: 1.4,
  })
  const edgeMaterial = new MeshStandardMaterial({ color: 0x0d0c0c, roughness: 0.3, metalness: 0.2 })
  const disc = new Mesh(new CylinderGeometry(1, 1, thickness, lite ? 72 : 128, 1), [
    edgeMaterial,
    topMaterial,
    edgeMaterial,
  ])
  spinner.add(disc)

  const label = new Mesh(
    new CircleGeometry(0.36, lite ? 48 : 96),
    new MeshStandardMaterial({
      map: createLabelTexture(lite ? 512 : 1024, maxAnisotropy),
      roughness: 0.55,
      metalness: 0.05,
      emissive: new Color(BROWN),
      emissiveIntensity: 0.25,
    }),
  )
  label.rotation.x = -Math.PI / 2
  label.position.y = thickness / 2 + 0.0015
  spinner.add(label)

  const spindle = new Mesh(
    new CylinderGeometry(0.022, 0.022, 0.07, 20),
    new MeshStandardMaterial({ color: 0xd9d4cc, metalness: 1, roughness: 0.2 }),
  )
  spindle.position.y = 0.03
  record.add(spindle)

  return { record, spinner }
}

function createEqualizerRing(count) {
  // Thin bars lying in the record's plane, radiating outward like a circular spectrum
  const geometry = new BoxGeometry(1, 0.016, 0.022)
  geometry.translate(0.5, 0, 0) // grow outward from the inner radius
  const material = new MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.7,
    roughness: 0.3,
    emissive: new Color(ACCENT),
    emissiveIntensity: 0.18,
    envMapIntensity: 1.1,
  })
  const mesh = new InstancedMesh(geometry, material, count)
  mesh.instanceMatrix.setUsage(DynamicDrawUsage)
  const innerRadius = 1.07
  const dummy = new Object3D()
  const low = new Color(BROWN).lerp(new Color(EMBER), 0.5)
  const high = new Color(ACCENT).multiplyScalar(1.15)
  const color = new Color()
  const angles = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    angles[i] = (i / count) * TAU
    mesh.setColorAt(i, low)
  }

  function update(time, energy) {
    for (let i = 0; i < count; i++) {
      const a = angles[i]
      // a few layered "frequency bands" travelling around the ring
      const v =
        0.5 +
        0.5 *
          (Math.sin(a * 3 + time * 1.7) * 0.5 +
            Math.sin(a * 7 - time * 2.6) * 0.3 +
            Math.sin(a * 13 + time * 4.1) * 0.2)
      const level = Math.pow(v, 2.4) * energy
      dummy.position.set(Math.cos(a) * innerRadius, 0, Math.sin(a) * innerRadius)
      dummy.rotation.set(0, -a, 0)
      dummy.scale.set(0.025 + level * 0.38, 1, 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, color.copy(low).lerp(high, Math.min(level * 1.6, 1)))
    }
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor.needsUpdate = true
  }

  return { mesh, update }
}

function createWaveField(cols, rows, width, pixelRatio) {
  const positions = new Float32Array(cols * rows * 3)
  const rand = new Float32Array(cols * rows)
  const depth = 11
  let k = 0
  for (let z = 0; z < rows; z++) {
    for (let x = 0; x < cols; x++) {
      const idx = z * cols + x
      positions[k++] = (x / (cols - 1) - 0.5) * width
      positions[k++] = 0
      positions[k++] = -9 + (z / (rows - 1)) * depth
      rand[idx] = Math.random()
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('aRand', new Float32BufferAttribute(rand, 1))

  const material = new ShaderMaterial({
    vertexShader: WAVE_VERTEX,
    fragmentShader: WAVE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uSize: { value: 34 },
      uMouse: { value: new Vector2() },
      uOpacity: { value: 0.9 },
      uColorLow: { value: new Color(BROWN) },
      uColorHigh: { value: new Color(ACCENT) },
    },
  })
  const points = new Points(geometry, material)
  points.position.y = -1.7
  points.frustumCulled = false
  return points
}

function createDust(count) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = MathUtils.randFloatSpread(12)
    positions[i * 3 + 1] = MathUtils.randFloatSpread(6)
    positions[i * 3 + 2] = MathUtils.randFloat(-5, 2.5)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const material = new PointsMaterial({
    size: 0.06,
    map: createDotTexture(64),
    color: ACCENT,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  return new Points(geometry, material)
}

/**
 * Mounts the scene into `container` and returns a controller.
 * Options: { lite: boolean, reducedMotion: boolean, onFirstFrame: () => void }
 */
export function createHeroScene(
  container,
  { lite = false, reducedMotion = false, onFirstFrame } = {},
) {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2)

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: !lite,
    powerPreference: lite ? 'low-power' : 'high-performance',
  })
  renderer.setPixelRatio(pixelRatio)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  container.appendChild(canvas)

  const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)

  const scene = new Scene()
  const envTarget = createEnvironment(renderer)
  scene.environment = envTarget.texture

  const camera = new PerspectiveCamera(35, 1, 0.1, 60)
  const cameraBase = { x: 0, y: 0.35, z: 7 }
  camera.position.set(cameraBase.x, cameraBase.y, cameraBase.z)

  // Lights: warm key from top-left, ember rim from the right, cool fill from behind
  const key = new DirectionalLight(0xffd9b0, 2.2)
  key.position.set(-3, 5, 4)
  const rim = new DirectionalLight(EMBER, 2.5)
  rim.position.set(5, 1, -3)
  const fill = new DirectionalLight(ICE, 0.35)
  fill.position.set(-4, -2, -5)
  const glow = new PointLight(ACCENT, 6, 6, 1.6)
  glow.position.set(0, 1.4, 1.2)
  scene.add(key, rim, fill)

  // Record + equalizer ring, grouped so they tilt together
  const hero = new Group()
  const tilt = new Group()
  hero.add(tilt)
  const { record, spinner } = createRecord(lite, maxAnisotropy)
  tilt.add(record)
  const eq = createEqualizerRing(lite ? 64 : 120)
  tilt.add(eq.mesh)
  hero.add(glow)
  scene.add(hero)

  const wave = createWaveField(lite ? 56 : 150, lite ? 44 : 64, lite ? 8 : 18, pixelRatio)
  scene.add(wave)

  const dust = createDust(lite ? 90 : 240)
  scene.add(dust)

  // Layout depends on the viewport aspect: record on the right on wide screens,
  // tucked low and centred on portrait phones so it never covers the headline.
  const layout = { x: 0, y: 0, scale: 1, tiltX: 0.95, tiltZ: -0.18 }
  function applyLayout(width, height) {
    const aspect = width / Math.max(height, 1)
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    const halfH = Math.tan(MathUtils.degToRad(camera.fov / 2)) * cameraBase.z
    const halfW = halfH * aspect
    if (aspect >= 1.1) {
      // Landscape: record on the right, partly cropped by the edge. On narrower landscape
      // screens the headline is relatively wider, so the record also slides lower.
      const wide = MathUtils.smoothstep(aspect, 1.25, 1.7)
      layout.scale = MathUtils.clamp(halfH * 0.5, 0.85, 1.25)
      layout.x = halfW - layout.scale * MathUtils.lerp(0.3, 0.48, wide)
      layout.y = MathUtils.lerp(-halfH * 0.55, 0.05, wide)
      layout.tiltZ = -0.22
    } else {
      // Portrait phones: tucked into the lower right, below the call to action
      layout.scale = MathUtils.clamp(halfW * 0.55, 0.5, 1)
      layout.x = halfW * 0.42
      layout.y = -halfH + layout.scale * 0.4
      layout.tiltZ = -0.12
    }
    hero.scale.setScalar(layout.scale)
    hero.position.set(layout.x, layout.y, 0)
    renderer.setSize(width, height, false)
  }

  // Input state (smoothed in the render loop)
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  let scrollProgress = 0
  let smoothScroll = 0

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1
  }
  function onScroll() {
    const h = container.offsetHeight || window.innerHeight
    scrollProgress = MathUtils.clamp(window.scrollY / h, 0, 1)
  }

  let rafId = 0
  let running = false
  let firstFrame = true
  let elapsed = 0
  let last = 0

  function renderFrame(dt) {
    elapsed += dt
    pointer.sx += (pointer.x - pointer.sx) * Math.min(dt * 3, 1)
    pointer.sy += (pointer.y - pointer.sy) * Math.min(dt * 3, 1)
    smoothScroll += (scrollProgress - smoothScroll) * Math.min(dt * 6, 1)

    // Parallax camera + zoom-out on scroll
    camera.position.x = cameraBase.x + pointer.sx * 0.45
    camera.position.y = cameraBase.y - pointer.sy * 0.3 + smoothScroll * 0.8
    camera.position.z = cameraBase.z + smoothScroll * 3.5
    camera.lookAt(0, -0.1 - smoothScroll * 0.6, 0)

    // Record: spin, tilt toward the pointer, gentle float
    spinner.rotation.y -= dt * 0.9
    tilt.rotation.x = layout.tiltX + pointer.sy * 0.12 + smoothScroll * 0.35
    tilt.rotation.z = layout.tiltZ - pointer.sx * 0.1
    tilt.rotation.y = smoothScroll * 0.6
    tilt.position.y = Math.sin(elapsed * 0.9) * 0.05
    hero.rotation.y = -0.25 + pointer.sx * 0.12

    eq.update(elapsed, 1 - smoothScroll * 0.6)

    const u = wave.material.uniforms
    u.uTime.value = elapsed
    u.uMouse.value.x = pointer.sx
    u.uMouse.value.y = pointer.sy

    dust.rotation.y = elapsed * 0.02
    dust.position.y = Math.sin(elapsed * 0.3) * 0.15

    canvas.style.opacity = String(1 - smoothScroll * 0.9)
    renderer.render(scene, camera)

    if (firstFrame) {
      firstFrame = false
      if (onFirstFrame) onFirstFrame()
    }
  }

  function tick(now) {
    if (!running) return
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60
    last = now
    renderFrame(dt)
    rafId = requestAnimationFrame(tick)
  }

  function start() {
    if (running || reducedMotion) return
    running = true
    last = 0
    rafId = requestAnimationFrame(tick)
  }

  function stop() {
    running = false
    cancelAnimationFrame(rafId)
  }

  const resizeObserver = new ResizeObserver((entries) => {
    const box = entries[0].contentRect
    if (!box.width || !box.height) return
    applyLayout(box.width, box.height)
    // Reduced motion: keep a single, static, well-composed frame
    if (reducedMotion || !running) renderFrame(0)
  })

  applyLayout(
    container.clientWidth || window.innerWidth,
    container.clientHeight || window.innerHeight,
  )
  resizeObserver.observe(container)

  if (reducedMotion) {
    elapsed = 1.2
    renderFrame(0)
  } else {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  function dispose() {
    stop()
    resizeObserver.disconnect()
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('scroll', onScroll)
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      const materials = Array.isArray(obj.material)
        ? obj.material
        : obj.material
          ? [obj.material]
          : []
      for (const material of materials) {
        for (const value of Object.values(material)) {
          if (value && value.isTexture) value.dispose()
        }
        material.dispose()
      }
    })
    envTarget.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }

  return { start, stop, dispose, canvas }
}
