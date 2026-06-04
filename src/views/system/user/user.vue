<script setup>
import { useAppWin } from '@/core/useAppWin';

const { navigate } = useAppWin();

function openU1() {
    navigate('/user/child/u1');
}
</script>

<template>
    <div class="column items-center justify-center h-full gap-10">
        <div class="text-h5">用户管理</div>
        <q-btn label="进入用户1" color="primary" rounded @click="openU1" />
    </div>
</template>
