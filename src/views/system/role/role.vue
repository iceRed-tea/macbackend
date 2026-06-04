<script setup>
import { useAppWin } from '@/core/useAppWin';

const { navigate } = useAppWin();

function openTest() {
    navigate('/role/test');
}
</script>

<template>
    <div>
        <h1>角色管理</h1>
        <q-btn label="测试" color="primary" rounded @click="openTest" />
    </div>
</template>
