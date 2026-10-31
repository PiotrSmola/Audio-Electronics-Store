// Small helpers shared by the motion composables. They are read on demand (not cached),
// so a change of the OS setting or of the input device is picked up without a reload.

function matches(query) {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false
}

/** true when the user asked the OS to minimise non-essential motion */
export function prefersReducedMotion() {
  return matches('(prefers-reduced-motion: reduce)')
}

/** true for a mouse/trackpad: hover effects make sense (false on touch screens) */
export function hasFinePointer() {
  return matches('(hover: hover) and (pointer: fine)')
}

export function useMotionPreferences() {
  return { prefersReducedMotion, hasFinePointer }
}
