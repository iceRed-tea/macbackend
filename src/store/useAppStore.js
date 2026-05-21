import { defineStore } from 'pinia';
import HeroImg from '@/assets/images/os/hero.jpg';

const useAppStore = defineStore(
    'app',
    () => {
        const windowSize = ref({
            width: 0,
            height: 0,
        });
        const config = ref({
            background: {
                url: HeroImg,
                blur: 0,
                brightness: 1,
            },
        });
        return {
            windowSize,
            config,
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
