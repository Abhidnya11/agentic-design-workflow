<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'destructive'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  type: {
    type: String,
    default: 'button',
    validator: (v) => ['button', 'submit', 'reset'].includes(v),
  },
  name: {
    type: String,
    default: undefined,
  },
  tooltip: {
    type: String,
    default: undefined,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const variantClasses = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-200 disabled:text-primary-400',
  secondary:
    'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:border-primary-200 disabled:text-primary-200',
  ghost:
    'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:text-primary-200',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-200 disabled:text-red-400',
}

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-base px-4 py-2 gap-2',
  lg: 'text-lg px-5 py-2.5 gap-2.5',
}

const spinnerSizeClasses = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

const isDisabledState = computed(() => props.isDisabled || props.isLoading)

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
  'disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size],
])

function handleClick(event) {
  if (isDisabledState.value) return
  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :name="name"
    :title="tooltip"
    :disabled="isDisabledState"
    :aria-busy="isLoading"
    :class="classes"
    @click="handleClick"
  >
    <svg
      v-if="isLoading"
      :class="['animate-spin', spinnerSizeClasses[size]]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
      />
    </svg>
    <span>{{ label }}</span>
  </button>
</template>
