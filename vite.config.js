import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { QuasarResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { quasar } from '@quasar/vite-plugin';

export default defineConfig({
    envDir: 'env',
    plugins: [
        vue(),
        autoImport({
            imports: ['vue', 'vue-router', 'pinia'],
            resolvers: [QuasarResolver(), ElementPlusResolver()],
        }),
        Components({
            resolvers: [QuasarResolver(), ElementPlusResolver()],
        }),
        quasar({ sassVariables: '@/assets/style/quasar-variables.scss' }),
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    base: '/',
    server: {
        host: '0.0.0.0',
        port: 9527,
        open: true,
    },
});
