import { defineStore } from 'pinia';
import HeroImg from '@/assets/images/os/hero.jpg';

const useWinStore = defineStore(
    'win',
    () => {
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
        const pages = ref([]);
        return {
            config,
            windows,
            pages,
        };
    },
    {
        persist: {
            key: 'win',
            pick: ['config'],
        },
    }
);

export default useWinStore;
