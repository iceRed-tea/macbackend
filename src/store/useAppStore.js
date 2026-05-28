import { defineStore } from 'pinia';
import HeroImg from '@/assets/images/os/hero.jpg';

const useAppStore = defineStore(
    'app',
    () => {
        // 窗口大小
        const windowSize = ref({
            width: 1980,
            height: 1080,
        });
        // 配置
        const config = ref({
            background: {
                url: HeroImg,
                blur: 0,
                brightness: 1,
            },
            window: {
                style: 'mac', //mac / win
            },
        });
        // 窗口列表
        const windows = ref([]);
        return {
            windowSize,
            config,
            windows,
        };
    },
    {
        persist: {
            key: 'app',
            pick: ['windowSize', 'config'],
        },
    }
);

export default useAppStore;
