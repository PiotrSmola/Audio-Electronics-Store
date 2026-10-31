<template>
  <div class="toast-container" role="status" aria-live="polite">
    <TransitionGroup
      name="toast"
      tag="div"
      class="toast-container__list"
      @before-leave="freezePosition"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :data-id="toast.id"
        class="toast"
        :class="[`toast--${toast.type}`, { 'toast--paused': pausedIds.includes(toast.id) }]"
        @pointerenter="pause(toast.id)"
        @pointerleave="resume(toast.id)"
        @focusin="pause(toast.id)"
        @focusout="resume(toast.id)"
      >
        <span class="toast__icon" aria-hidden="true">
          <!-- success: a small eighth note; info / error: a Material icon -->
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 32" focusable="false">
            <path d="M10 3v19.2A5 5 0 1 0 12 26V9.5c3.4.8 6 3 6.8 6.5.9-5.2-2.6-9.2-8.8-13z" />
          </svg>
          <v-icon v-else size="18">{{ iconFor(toast.type) }}</v-icon>
        </span>
        <div class="toast__body">
          <p class="toast__label">{{ labelFor(toast.type) }}</p>
          <p class="toast__message">{{ toast.message }}</p>
        </div>
        <button
          type="button"
          class="toast__close"
          aria-label="Close notification"
          @click="dismissToast(toast.id)"
        >
          <v-icon size="16">mdi-close</v-icon>
        </button>
        <!-- remaining time (paused while hovered/focused, like the auto-dismiss timer) -->
        <span
          v-if="toast.duration > 0"
          class="toast__progress"
          :style="{ animationDuration: `${toast.duration}ms` }"
          aria-hidden="true"
        ></span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'

const icons = {
  success: 'mdi-check',
  error: 'mdi-alert-circle-outline',
  info: 'mdi-information-outline',
}

// small mono label above the message
const labels = {
  success: 'Done',
  error: 'Error',
  info: 'Note',
}

export default {
  name: 'ToastComponent',
  data() {
    return {
      pausedIds: [],
    }
  },
  computed: {
    toasts() {
      return useToast().toasts
    },
  },
  methods: {
    dismissToast(id) {
      useToast().dismissToast(id)
    },
    pause(id) {
      useToast().pauseToast(id)
      if (!this.pausedIds.includes(id)) this.pausedIds.push(id)
    },
    resume(id) {
      useToast().resumeToast(id)
      this.pausedIds = this.pausedIds.filter((pausedId) => pausedId !== id)
    },
    iconFor(type) {
      return icons[type] || icons.info
    },
    labelFor(type) {
      return labels[type] || labels.info
    },
    freezePosition(el) {
      // Take the leaving toast out of the flow at its current spot, so the others can glide
      // into place (.toast-move) while it slides away
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = el
      Object.assign(el.style, {
        position: 'absolute',
        top: `${offsetTop}px`,
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`,
      })
      const leavingId = Number(el.dataset.id)
      this.pausedIds = this.pausedIds.filter((id) => id !== leavingId)
    },
  },
}
</script>

<style lang="scss">
@use '@/assets/scss/tokens' as t;

// muted clay for errors: warm and in the palette's family, not an alarm red
$toast-error: #c4907c;

.toast-container {
  position: fixed;
  right: 2.4rem;
  bottom: 2.4rem;
  z-index: 10000;
  pointer-events: none;

  @media (max-width: 576px) {
    right: 1.2rem;
    left: 1.2rem;
    bottom: 1.2rem;
  }

  &__list {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
  }
}

.toast {
  --toast-accent: #{t.$brass};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 1.4rem;
  min-width: 300px;
  max-width: 400px;
  padding: 1.5rem 1.4rem 1.6rem 1.6rem;
  background-color: t.$ink;
  color: t.$text-on-dark;
  border: 1px solid t.$line-on-dark;
  border-radius: t.$radius-sm;
  box-shadow: 0 22px 40px -24px rgba(0, 0, 0, 0.75);
  pointer-events: auto;

  @media (max-width: 576px) {
    min-width: 0;
    max-width: none;
    width: 100%;
  }

  &--error {
    --toast-accent: #{$toast-error};
  }

  &__icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid t.$line-on-dark;
    color: var(--toast-accent);

    svg {
      width: 12px;
      height: 16px;
      fill: currentColor;
    }
  }

  &--success &__icon svg {
    animation: toast-note-bob 2.4s ease-in-out infinite;
  }

  &__body {
    flex: 1;
    min-width: 0;
    padding-top: 0.1rem;
  }

  &__label {
    font-family: t.$font-mono;
    font-size: 1.05rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--toast-accent);
  }

  &__message {
    margin-top: 0.4rem;
    font-size: 1.4rem;
    line-height: 1.45;
    color: t.$text-on-dark;

    @media (max-width: 576px) {
      font-size: 1.35rem;
    }
  }

  &__close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    margin: -0.2rem -0.2rem 0 0;
    border-radius: 50%;
    background: none;
    border: none;
    color: t.$muted-on-dark;
    cursor: pointer;
    transition:
      color 0.3s,
      background-color 0.3s;

    &:hover,
    &:focus-visible {
      color: t.$brass;
      background-color: rgba(190, 156, 121, 0.1);
    }
  }

  // remaining time: a hairline that runs down along the bottom edge
  &__progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background-color: var(--toast-accent);
    opacity: 0.8;
    transform-origin: left center;
    animation: toast-progress linear forwards;
  }

  &--paused &__progress {
    animation-play-state: paused;
  }
}

/* Enter: slides in from the right with a slight spring; leave: drifts out and fades;
   move: the remaining toasts glide into their new place */
.toast-enter-active {
  transition:
    transform 0.6s cubic-bezier(0.34, 1.3, 0.64, 1),
    opacity 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(calc(100% + 2rem)) scale(0.97);
}

.toast-leave-active {
  transition:
    transform 0.4s cubic-bezier(0.55, 0, 0.75, 0.2),
    opacity 0.35s ease;
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(40%) scale(0.95);
}

.toast-move {
  transition: transform 0.45s t.$ease-out;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

@keyframes toast-note-bob {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-2px) rotate(-8deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition: none;
  }

  .toast--success .toast__icon svg {
    animation: none;
  }

  /* a constantly shrinking bar is motion too - the timer itself still works */
  .toast__progress {
    animation: none;
    display: none;
  }
}
</style>
