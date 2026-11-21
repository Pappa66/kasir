import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { terapkanTema } from './stores/tema'

terapkanTema(localStorage.getItem('demo-tema') || 'kasir')

createApp(App).use(createPinia()).use(router).mount('#app')
