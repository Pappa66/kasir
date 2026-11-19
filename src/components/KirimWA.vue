<template>
  <Modal :open="open" title="Kirim via WhatsApp" :subtitle="subjudul" lebar="max-w-lg" @close="$emit('close')">
    <div class="space-y-3 px-4 py-4">
      <div class="flex flex-wrap items-center gap-2">
        <AddonTag />
        <span class="text-2xs text-ink-soft">
          Membuka WhatsApp dengan pesan yang sudah terisi. Pesan tidak terkirim otomatis.
        </span>
      </div>

      <div>
        <label class="label" for="wa-hp">Nomor WhatsApp</label>
        <input
          id="wa-hp"
          v-model="hp"
          type="tel"
          inputmode="tel"
          class="input tnum"
          placeholder="08xx-xxxx-xxxx"
        />
        <p class="mt-1 text-2xs text-ink-soft">
          Nomor 08… otomatis diubah ke format 62… saat membuka WhatsApp.
        </p>
      </div>

      <div>
        <label class="label" for="wa-pesan">Isi pesan</label>
        <textarea
          id="wa-pesan"
          :value="pesan"
          rows="9"
          readonly
          class="input h-auto resize-none py-2 font-mono text-[11px] leading-relaxed"
        />
      </div>
    </div>

    <template #footer>
      <span class="text-2xs text-ink-soft">Demo — tidak ada API WhatsApp.</span>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn" @click="salin">Salin pesan</button>
        <button type="button" class="btn btn-primary" :disabled="!nomorWA(hp)" @click="buka">
          Buka WhatsApp
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import Modal from './Modal.vue'
import AddonTag from './AddonTag.vue'
import { nomorWA, tautanWA } from '../lib/ekspor'
import { useUi } from '../stores/ui'

const props = defineProps({
  open: { type: Boolean, default: false },
  subjudul: { type: String, default: 'Bagikan rincian invoice' },
  nomor: { type: String, default: '' },
  pesan: { type: String, default: '' },
})

defineEmits(['close'])

const ui = useUi()
const hp = ref(props.nomor || '')

watch(
  () => [props.open, props.nomor],
  () => {
    if (props.open) hp.value = props.nomor || ''
  },
  { immediate: true },
)

async function salin() {
  try {
    await navigator.clipboard.writeText(props.pesan)
    ui.kabari('Pesan disalin. Tempel di WhatsApp.', 'ok')
  } catch {
    ui.kabari('Browser menolak akses clipboard. Salin manual dari kotak pesan.', 'warn')
  }
}

function buka() {
  if (!nomorWA(hp.value)) return ui.kabari('Nomor WhatsApp belum diisi.', 'warn')
  window.open(tautanWA(hp.value, props.pesan), '_blank', 'noopener')
  ui.kabari('WhatsApp dibuka di tab baru. Periksa pesan sebelum mengirim.', 'info')
}
</script>
