<script setup>
import { useAppWin } from '@/core/useAppWin';

const { navigate } = useAppWin();

function openSon() {
    navigate(() => import('./child/son.vue'), {}, 'Son 页面');
}
</script>

<template>
    <div class="column items-center justify-center h-full gap-10">
        <div class="text-h5">用户1</div>
        <q-btn label="进入子页面" color="secondary" rounded @click="openSon" />
    </div>
</template>
