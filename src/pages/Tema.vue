<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Pilihan tampilan</h2>
        <p class="mt-0.5 text-xs text-ink-soft">
          Tiga arah desain untuk aplikasi yang sama. Ganti kapan saja, data tidak berubah.
        </p>
      </div>
      <span class="rounded border border-line bg-paper px-2 py-1 text-2xs text-ink-soft">
        Alat demo, bukan fitur tambahan
      </span>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3" data-tour="tema-grid">
      <section
        v-for="t in tema.daftar"
        :key="t.id"
        :data-tema="t.id"
        class="panel overflow-hidden"
      >
        <div class="flex items-start justify-between gap-2 border-b border-line bg-paper p-3">
          <div class="min-w-0">
            <div class="text-sm font-semibold text-ink">{{ t.nama }}</div>
            <div class="mt-0.5 text-2xs leading-relaxed text-ink-soft">{{ t.ket }}</div>
          </div>
          <button
            type="button"
            class="btn btn-sm shrink-0"
            :class="tema.aktif === t.id ? 'btn-primary' : ''"
            @click="tema.pakai(t.id)"
          >
            {{ tema.aktif === t.id ? 'Dipakai' : 'Pakai' }}
          </button>
        </div>

        <div class="space-y-3 bg-surface p-3">
          <div class="panel p-3">
            <div class="text-2xs uppercase tracking-[0.06em] text-ink-soft">Omzet hari ini</div>
            <div class="mt-1 text-xl font-semibold tnum">{{ rupiah(4331775) }}</div>
            <div class="mt-0.5 text-2xs text-ink-soft">70 transaksi · 297 item</div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn btn-sm btn-primary">Bayar</button>
            <button type="button" class="btn btn-sm">Cetak</button>
            <span class="status text-ok">Lunas</span>
            <span class="status text-warn">Bon</span>
          </div>

          <table class="tbl">
            <thead>
              <tr>
                <th>Produk</th>
                <th class="num">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Beras 5 kg</td>
                <td class="num">68.000</td>
              </tr>
              <tr>
                <td>Minyak 2 L</td>
                <td class="num">36.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <section class="panel" data-tour="tema-tabel">
      <div class="panel-h">
        <span class="panel-title">Pertimbangan</span>
      </div>
      <div class="divide-y divide-line sm:hidden">
        <div v-for="p in pertimbangan" :key="p.tema" class="px-4 py-3">
          <div class="text-sm font-medium text-ink">{{ p.tema }}</div>
          <dl class="mt-2 space-y-2 text-xs">
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Kelebihan</dt>
              <dd class="mt-0.5 leading-relaxed text-ink">{{ p.kelebihan }}</dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Kekurangan</dt>
              <dd class="mt-0.5 leading-relaxed text-ink">{{ p.kekurangan }}</dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Cocok untuk</dt>
              <dd class="mt-0.5 leading-relaxed text-ink">{{ p.cocok }}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="hidden overflow-x-auto sm:block">
        <table class="tbl">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Kelebihan</th>
              <th>Kekurangan</th>
              <th>Cocok untuk</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pertimbangan" :key="p.tema">
              <td class="font-medium">{{ p.tema }}</td>
              <td>{{ p.kelebihan }}</td>
              <td>{{ p.kekurangan }}</td>
              <td>{{ p.cocok }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="border-t border-line px-4 py-3 text-xs leading-relaxed text-ink-soft">
        Warna status (hijau normal, kuning peringatan, merah bahaya) tetap sama di ketiga tema supaya
        artinya tidak berubah. Struk thermal selalu hitam-putih.
      </p>
    </section>
  </div>
</template>

<script setup>
import { useTema } from '../stores/tema'
import { rupiah } from '../lib/format'

const tema = useTema()

const pertimbangan = [
  {
    tema: 'Kasir',
    kelebihan: 'Cepat dipelajari, tidak melelahkan, aman dicetak',
    kekurangan: 'Terasa biasa, kurang menonjol',
    cocok: 'Toko kelontong, staf senior, shift panjang',
  },
  {
    tema: 'Brutal',
    kelebihan: 'Paling mudah diingat, bagus untuk konten sosial',
    kekurangan: 'Melelahkan untuk shift panjang, data padat terasa ramai',
    cocok: 'Merek muda, kopi/snack, toko yang ingin menonjol',
  },
  {
    tema: 'Elegan',
    kelebihan: 'Kesan premium dan tenang',
    kekurangan: 'Kepadatan lebih rendah, layar kecil lebih banyak scroll',
    cocok: 'Toko premium, hampers, oleh-oleh',
  },
]
</script>
