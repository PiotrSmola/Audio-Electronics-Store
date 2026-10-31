import { prefersReducedMotion } from './useMotionPreferences'

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Tween a number with requestAnimationFrame (count up / count down).
 * With prefers-reduced-motion the final value is reported immediately.
 *
 * @param {object} options
 * @param {number} options.from - start value
 * @param {number} options.to - end value
 * @param {(value: number) => void} options.onUpdate - called every frame with the current value
 * @param {number} [options.duration=700] - ms
 * @param {(t: number) => number} [options.easing=easeOutCubic]
 * @returns {() => void} cancel function (stops where it is)
 */
export function tweenNumber({ from, to, onUpdate, duration = 700, easing = easeOutCubic }) {
  if (from === to || prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
    onUpdate(to)
    return () => {}
  }

  let frame = 0
  let startTime = 0
  const step = (time) => {
    if (!startTime) startTime = time
    const progress = Math.min((time - startTime) / duration, 1)
    onUpdate(progress === 1 ? to : from + (to - from) * easing(progress))
    if (progress < 1) frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

export function useAnimatedNumber() {
  return { tweenNumber }
}
