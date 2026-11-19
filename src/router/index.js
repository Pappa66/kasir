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

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { title: 'Dashboard' } },
  { path: '/kasir', name: 'kasir', component: Kasir, meta: { title: 'Kasir' } },
  { path: '/produk', name: 'produk', component: Produk, meta: { title: 'Produk' } },
  { path: '/stok-masuk', name: 'stok-masuk', component: StokMasuk, meta: { title: 'Stok Masuk' } },
  { path: '/invoice', name: 'invoice', component: Invoice, meta: { title: 'Invoice' } },
  {
    path: '/invoice/:nomor',
    name: 'invoice-detail',
    component: InvoiceDetail,
    meta: { title: 'Detail Invoice' },
  },
  { path: '/opname', name: 'opname', component: Opname, meta: { title: 'Stock Opname' } },
  {
    path: '/opname/:id',
    name: 'opname-sheet',
    component: OpnameSheet,
    meta: { title: 'Hitung Opname' },
  },
  { path: '/laporan', name: 'laporan', component: Laporan, meta: { title: 'Laporan' } },
  { path: '/pengaturan', name: 'pengaturan', component: Pengaturan, meta: { title: 'Pengaturan' } },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
