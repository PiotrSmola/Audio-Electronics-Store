import { reactive, readonly } from 'vue'

// Lightweight global toast queue shared by the whole app.
// Rendered once by ToastComponent (mounted in App.vue).

const DEFAULT_DURATION = 3000
const MAX_TOASTS = 4

const state = reactive({
  toasts: [],
})

// Timers are kept outside the reactive state: id -> { timeout, remaining, startedAt }
const timers = new Map()

let nextId = 1

function clearTimer(id) {
  const timer = timers.get(id)
  if (timer) clearTimeout(timer.timeout)
  timers.delete(id)
}

function dismissToast(id) {
  clearTimer(id)
  const index = state.toasts.findIndex((toast) => toast.id === id)
  if (index !== -1) state.toasts.splice(index, 1)
}

function startTimer(id, remaining) {
  timers.set(id, {
    remaining,
    startedAt: Date.now(),
    timeout: setTimeout(() => dismissToast(id), remaining),
  })
}

/**
 * Show a toast message.
 * @param {string} message - text to display
 * @param {'success' | 'error' | 'info'} [type='success'] - visual variant
 * @param {number} [duration=3000] - time in ms before the toast disappears (0 = stays until closed)
 * @returns {number} id of the created toast
 */
function showToast(message, type = 'success', duration = DEFAULT_DURATION) {
  const id = nextId++
  state.toasts.push({ id, message, type, duration })
  if (state.toasts.length > MAX_TOASTS) dismissToast(state.toasts[0].id)
  if (duration > 0) startTimer(id, duration)
  return id
}

/** Freeze the auto-dismiss countdown (e.g. while the toast is hovered). */
function pauseToast(id) {
  const timer = timers.get(id)
  if (!timer || timer.paused) return
  clearTimeout(timer.timeout)
  timer.remaining = Math.max(timer.remaining - (Date.now() - timer.startedAt), 0)
  timer.paused = true
}

/** Continue a countdown paused with pauseToast. */
function resumeToast(id) {
  const timer = timers.get(id)
  if (!timer?.paused) return
  startTimer(id, timer.remaining)
}

export function useToast() {
  return {
    toasts: readonly(state.toasts),
    showToast,
    dismissToast,
    pauseToast,
    resumeToast,
  }
}
