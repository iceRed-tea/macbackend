import { createApp } from 'vue';
import App from './App.vue';
import 'quasar/src/css/index.sass';
import 'element-plus/dist/index.css';
import '@/assets/style/el-plus.scss';
import quasar from '@/boot/quasar.config';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia).use(quasar).use(router).mount('#app');
