<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-40 overflow-y-auto bg-[#0f2f2e]/45 p-3 py-6 sm:p-4 sm:py-10"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')"
    >
      <div
        class="mx-auto w-full rounded-lg border border-line bg-paper shadow-[0_12px_40px_rgba(15,47,46,0.22)]"
        :class="lebar"
      >
        <div class="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div class="min-w-0">
            <div class="truncate text-sm font-semibold text-ink">{{ title }}</div>
            <div v-if="subtitle" class="truncate text-2xs text-ink-soft">{{ subtitle }}</div>
          </div>
          <button
            type="button"
            class="shrink-0 text-ink-soft transition-colors hover:text-ink"
            title="Tutup"
            @click="$emit('close')"
          >
            <X :size="18" :stroke-width="1.6" />
          </button>
        </div>

        <slot />

        <div
          v-if="$slots.footer"
          class="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  lebar: { type: String, default: 'max-w-lg' },
})

const emit = defineEmits(['close'])

const onKey = (e) => {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (v) => {
    if (v) document.addEventListener('keydown', onKey)
    else document.removeEventListener('keydown', onKey)
  },
  { immediate: true },
)

onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>
