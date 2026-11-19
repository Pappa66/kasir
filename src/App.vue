<template>
  <AppShell>
    <RouterView />
  </AppShell>
  <PrototypeBanner />
  <CetakStruk />
  <TourGuide />
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppShell from './components/AppShell.vue'
import PrototypeBanner from './components/PrototypeBanner.vue'
import CetakStruk from './components/CetakStruk.vue'
import TourGuide from './components/TourGuide.vue'
</script>
