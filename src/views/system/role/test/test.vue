<script setup>
import { useAppWin } from '@/core/useAppWin';

const { navigate } = useAppWin();

function openUser() {
    navigate('/user');
}
</script>

<template>
    <div>
        <h1>测试页面</h1>
        <q-btn label="进入user" color="primary" rounded @click="openUser" />
    </div>
</template>
