<script setup>
import { useAppWin } from '@/core/useAppWin';

const { goBack } = useAppWin();
</script>

<template>
    <div class="column items-center justify-center h-full gap-10">
        <div class="text-h5">Son 页面</div>
        <div class="text-caption text-grey">已到最深层级</div>
        <q-btn label="返回上一级" color="negative" rounded flat @click="goBack" />
    </div>
</template>
