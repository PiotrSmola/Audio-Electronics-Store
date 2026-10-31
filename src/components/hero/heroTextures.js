// Procedural canvas textures for the hero vinyl record (no image downloads needed).
import { CanvasTexture, SRGBColorSpace, NoColorSpace, LinearMipmapLinearFilter } from 'three'

// Radii in UV space of the record's top face (0.5 = outer edge)
const LABEL_R = 0.18
const GROOVE_START = 0.2
const GROOVE_END = 0.485

// Track gaps (smooth, shinier bands between songs), as fractions of the groove area
const TRACK_GAPS = [0.16, 0.34, 0.5, 0.71, 0.86]

function makeCanvas(size) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  return canvas
}

function finish(texture, colorSpace, anisotropy) {
  texture.colorSpace = colorSpace
  texture.anisotropy = anisotropy
  texture.minFilter = LinearMipmapLinearFilter
  texture.needsUpdate = true
  return texture
}

/**
 * Builds the three maps of the vinyl surface in one pass over the pixels:
 * - roughnessMap: fine concentric grooves (rough) separated by glossy track gaps
 * - anisotropyMap: tangential direction, so highlights stretch like on a real record
 * - map: near-black base colour with very subtle groove shading
 */
export function createVinylTextures(size, maxAnisotropy) {
  const colorCanvas = makeCanvas(size)
  const roughCanvas = makeCanvas(size)
  const anisoCanvas = makeCanvas(size)
  const colorCtx = colorCanvas.getContext('2d')
  const roughCtx = roughCanvas.getContext('2d')
  const anisoCtx = anisoCanvas.getContext('2d')
  const colorImg = colorCtx.createImageData(size, size)
  const roughImg = roughCtx.createImageData(size, size)
  const anisoImg = anisoCtx.createImageData(size, size)

  const half = size / 2
  const grooveFreq = size * 0.9 // number of visible micro-grooves scales with resolution

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const i = (py * size + px) * 4
      const dx = (px + 0.5 - half) / size
      const dy = (py + 0.5 - half) / size
      const r = Math.sqrt(dx * dx + dy * dy)

      let rough = 0.5
      let shade = 14
      let strength = 0

      if (r >= GROOVE_START && r <= GROOVE_END) {
        const t = (r - GROOVE_START) / (GROOVE_END - GROOVE_START)
        let inGap = false
        for (let g = 0; g < TRACK_GAPS.length; g++) {
          if (Math.abs(t - TRACK_GAPS[g]) < 0.006) inGap = true
        }
        if (inGap) {
          rough = 0.12
          shade = 8
          strength = 0.2
        } else {
          const groove = 0.5 + 0.5 * Math.sin(r * grooveFreq * Math.PI)
          const fine = 0.5 + 0.5 * Math.sin(r * grooveFreq * 0.31 * Math.PI)
          rough = 0.26 + groove * 0.16 + fine * 0.06
          shade = 12 + groove * 6
          strength = 1
        }
      } else if (r > GROOVE_END && r <= 0.5) {
        // lead-in edge: smooth and glossy
        rough = 0.14
        shade = 9
        strength = 0.3
      } else if (r > LABEL_R && r < GROOVE_START) {
        // run-out area near the label
        rough = 0.18
        shade = 10
        strength = 0.4
      }

      colorImg.data[i] = shade
      colorImg.data[i + 1] = shade
      colorImg.data[i + 2] = shade + 1
      colorImg.data[i + 3] = 255

      const rv = Math.round(rough * 255)
      roughImg.data[i] = rv
      roughImg.data[i + 1] = rv
      roughImg.data[i + 2] = rv
      roughImg.data[i + 3] = 255

      // Tangential direction (perpendicular to the radius) encoded into [0, 1]
      const len = r || 1
      const tx = -dy / len
      const ty = dx / len
      anisoImg.data[i] = Math.round((tx * 0.5 + 0.5) * 255)
      anisoImg.data[i + 1] = Math.round((ty * 0.5 + 0.5) * 255)
      anisoImg.data[i + 2] = Math.round(strength * 255)
      anisoImg.data[i + 3] = 255
    }
  }

  colorCtx.putImageData(colorImg, 0, 0)
  roughCtx.putImageData(roughImg, 0, 0)
  anisoCtx.putImageData(anisoImg, 0, 0)

  return {
    map: finish(new CanvasTexture(colorCanvas), SRGBColorSpace, maxAnisotropy),
    roughnessMap: finish(new CanvasTexture(roughCanvas), NoColorSpace, maxAnisotropy),
    anisotropyMap: finish(new CanvasTexture(anisoCanvas), NoColorSpace, maxAnisotropy),
  }
}

function curvedText(ctx, text, cx, cy, radius, startAngle, spacing) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(startAngle)
  for (const char of text) {
    ctx.save()
    ctx.translate(0, -radius)
    ctx.fillText(char, 0, 0)
    ctx.restore()
    ctx.rotate(spacing)
  }
  ctx.restore()
}

/** Warm, brand-coloured record label. */
export function createLabelTexture(size, maxAnisotropy) {
  const canvas = makeCanvas(size)
  const ctx = canvas.getContext('2d')
  const c = size / 2

  const gradient = ctx.createRadialGradient(c * 0.8, c * 0.7, size * 0.05, c, c, c)
  gradient.addColorStop(0, '#e2c39f')
  gradient.addColorStop(0.55, '#be9c79')
  gradient.addColorStop(1, '#7a4a28')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(c, c, c, 0, Math.PI * 2)
  ctx.fill()

  // thin printed rings
  ctx.strokeStyle = 'rgba(65, 14, 1, 0.55)'
  ctx.lineWidth = size * 0.006
  for (const r of [0.94, 0.9, 0.42]) {
    ctx.beginPath()
    ctx.arc(c, c, c * r, 0, Math.PI * 2)
    ctx.stroke()
  }

  const font = "'Open Sans', 'Roboto', sans-serif"
  ctx.fillStyle = '#410e01'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = `600 ${size * 0.05}px ${font}`
  curvedText(ctx, 'AUDIO ELECTRONICS STORE', c, c, c * 0.74, -1.25, 0.109)

  ctx.font = `700 ${size * 0.085}px ${font}`
  ctx.fillText('SUPERIOR', c, c - size * 0.17)
  ctx.font = `400 ${size * 0.05}px ${font}`
  ctx.fillText('SOUND', c, c + size * 0.16)
  ctx.font = `600 ${size * 0.04}px ${font}`
  ctx.fillText('33⅓ RPM · SIDE A', c, c + size * 0.27)

  // spindle hole
  ctx.fillStyle = '#0b0a0a'
  ctx.beginPath()
  ctx.arc(c, c, size * 0.035, 0, Math.PI * 2)
  ctx.fill()

  return finish(new CanvasTexture(canvas), SRGBColorSpace, maxAnisotropy)
}

/** Soft round sprite for the floating dust particles. */
export function createDotTexture(size) {
  const canvas = makeCanvas(size)
  const ctx = canvas.getContext('2d')
  const c = size / 2
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c)
  gradient.addColorStop(0, 'rgba(255, 240, 220, 1)')
  gradient.addColorStop(0.25, 'rgba(230, 190, 150, 0.8)')
  gradient.addColorStop(1, 'rgba(190, 156, 121, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}
