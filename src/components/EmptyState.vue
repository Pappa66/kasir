<template>
  <div class="flex flex-col items-center justify-center px-6 py-12 text-center">
    <component :is="icon" :size="20" :stroke-width="1.5" class="mb-3 text-[#9aa8a5]" />
    <p class="text-sm font-medium text-ink">{{ title }}</p>
    <p v-if="desc" class="mt-1 max-w-md text-xs text-ink-soft">{{ desc }}</p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: [Object, Function], required: true },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
})
</script>
