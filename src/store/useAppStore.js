import { defineStore } from 'pinia';

const useAppStore = defineStore(
    'app',
    () => {
        const windowSize = ref({
            width: 0,
            height: 0,
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
