import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
        UnoCSS(),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: '/src' },
            {
                find: /^winbox$/,
                replacement: path.resolve(__dirname, 'packages/winbox/src/js/winbox.js'),
            },
        ],
    },
    base: '/',
    server: {
        host: '0.0.0.0',
        port: 9527,
        open: true,
    },
});
