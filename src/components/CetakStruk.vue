<template>
  <Teleport to="body">
    <div v-if="cetak.isi" id="cetak-root">
      <StrukPreview v-bind="cetak.isi" />
    </div>
  </Teleport>
</template>

<script setup>
import StrukPreview from './StrukPreview.vue'
import { useCetak } from '../stores/cetak'

const cetak = useCetak()
</script>
