<template>
  <RouterView v-if="publik" />
  <template v-else>
    <AppShell>
      <RouterView />
    </AppShell>
    <PrototypeBanner />
    <TourGuide />
  </template>
  <CetakStruk />
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppShell from './components/AppShell.vue'
import PrototypeBanner from './components/PrototypeBanner.vue'
import CetakStruk from './components/CetakStruk.vue'
import TourGuide from './components/TourGuide.vue'

const route = useRoute()
const publik = computed(() => !!route.meta.publik)
</script>
