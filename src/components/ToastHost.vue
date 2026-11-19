<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed bottom-11 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0"
      aria-live="polite"
    >
      <div
        v-if="ui.pesan"
        class="flex items-start gap-2 rounded border bg-paper px-3 py-2 text-xs shadow-[0_4px_16px_rgba(15,47,46,0.14)]"
        :class="ui.nada === 'ok' ? 'border-[#b7ddc9]' : ui.nada === 'warn' ? 'border-[#e3c9a8]' : 'border-line'"
      >
        <component
          :is="ikon"
          :size="14"
          :stroke-width="1.6"
          class="mt-0.5 shrink-0"
          :class="ui.nada === 'ok' ? 'text-ok' : ui.nada === 'warn' ? 'text-warn' : 'text-accent-2'"
        />
        <span class="text-ink">{{ ui.pesan }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-vue-next'
import { useUi } from '../stores/ui'

const ui = useUi()
const ikon = computed(() =>
  ui.nada === 'ok' ? CheckCircle2 : ui.nada === 'warn' ? AlertTriangle : Info,
)
</script>
