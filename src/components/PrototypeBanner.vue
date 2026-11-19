<template>
  <div
    class="pointer-events-none fixed bottom-0 left-[56px] right-0 z-30 flex h-8 items-center justify-center gap-2 border-t border-[#e3c9a8] bg-[#fdf6ec] px-3 text-2xs text-warn lg:left-[232px]"
    role="status"
  >
    <AlertTriangle :size="12" :stroke-width="1.6" class="shrink-0" />
    <span class="truncate">Prototipe — data contoh, belum tersimpan</span>
  </div>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next'
</script>
