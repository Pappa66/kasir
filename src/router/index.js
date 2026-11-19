import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Kasir from '../pages/Kasir.vue'
import Produk from '../pages/Produk.vue'
import StokMasuk from '../pages/StokMasuk.vue'
import Invoice from '../pages/Invoice.vue'
import InvoiceDetail from '../pages/InvoiceDetail.vue'
import Opname from '../pages/Opname.vue'
import OpnameSheet from '../pages/OpnameSheet.vue'
import Laporan from '../pages/Laporan.vue'
import Pengaturan from '../pages/Pengaturan.vue'
import Panduan from '../pages/Panduan.vue'
import PanduanMemilih from '../pages/PanduanMemilih.vue'
import AksesTerbatas from '../pages/AksesTerbatas.vue'
import Piutang from '../pages/Piutang.vue'
import Kedaluwarsa from '../pages/Kedaluwarsa.vue'
import InvoicePublik from '../pages/InvoicePublik.vue'
import { useSesi } from '../stores/sesi'

const PEMILIK = ['pemilik']
const SEMUA = ['pemilik', 'kasir']

const routes = [
  {
    path: '/',
    redirect: () => (useSesi().peran === 'pemilik' ? '/dashboard' : '/kasir'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard', peran: PEMILIK },
  },
  {
    path: '/kasir',
    name: 'kasir',
    component: Kasir,
    meta: { title: 'Kasir', peran: SEMUA },
  },
  {
    path: '/produk',
    name: 'produk',
    component: Produk,
    meta: { title: 'Produk', peran: SEMUA },
  },
  {
    path: '/stok-masuk',
    name: 'stok-masuk',
    component: StokMasuk,
    meta: { title: 'Stok Masuk', peran: PEMILIK },
  },
  {
    path: '/invoice',
    name: 'invoice',
    component: Invoice,
    meta: { title: 'Invoice', peran: SEMUA },
  },
  {
    path: '/invoice/:nomor',
    name: 'invoice-detail',
    component: InvoiceDetail,
    meta: { title: 'Detail Invoice', peran: SEMUA },
  },
  {
    path: '/piutang',
    name: 'piutang',
    component: Piutang,
    meta: { title: 'Piutang & Bon', peran: PEMILIK },
  },
  {
    path: '/kedaluwarsa',
    name: 'kedaluwarsa',
    component: Kedaluwarsa,
    meta: { title: 'Kedaluwarsa', peran: PEMILIK },
  },
  {
    path: '/publik/:nomor',
    name: 'invoice-publik',
    component: InvoicePublik,
    meta: { title: 'Invoice Publik', publik: true },
  },
  {
    path: '/opname',
    name: 'opname',
    component: Opname,
    meta: { title: 'Stock Opname', peran: PEMILIK },
  },
  {
    path: '/opname/:id',
    name: 'opname-sheet',
    component: OpnameSheet,
    meta: { title: 'Hitung Opname', peran: PEMILIK },
  },
  {
    path: '/laporan',
    name: 'laporan',
    component: Laporan,
    meta: { title: 'Laporan', peran: PEMILIK },
  },
  {
    path: '/pengaturan',
    name: 'pengaturan',
    component: Pengaturan,
    meta: { title: 'Pengaturan', peran: PEMILIK },
  },
  {
    path: '/panduan',
    name: 'panduan',
    component: Panduan,
    meta: { title: 'Panduan', peran: SEMUA },
  },
  {
    path: '/panduan-memilih',
    name: 'panduan-memilih',
    component: PanduanMemilih,
    meta: { title: 'Panduan memilih', peran: SEMUA },
  },
  {
    path: '/akses-terbatas',
    name: 'akses-terbatas',
    component: AksesTerbatas,
    meta: { title: 'Akses terbatas', peran: SEMUA },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  if (to.meta.publik) return true
  const izin = to.meta.peran
  if (izin && !izin.includes(useSesi().peran)) {
    return { path: '/akses-terbatas', query: { dari: to.fullPath } }
  }
})

export default router
