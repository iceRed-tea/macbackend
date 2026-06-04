import { defineStore } from 'pinia';

const useAppStore = defineStore(
    'app',
    () => {
        // 窗口大小
        const windowSize = ref({
            width: 1980,
            height: 1080,
        });

        return {
            windowSize,
        };
    },
    {
        persist: {
            key: 'app',
            pick: ['windowSize'],
        },
    }
);

export default useAppStore;
