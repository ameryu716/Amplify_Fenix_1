<script setup lang="ts">
import { useConfirmControl } from '@/composables/ConfirmControl';

const { show, title, message, showDialog } = useConfirmControl();


</script>
<template>
    <dialog v-if="show" class="active">
        <h5>{{ title }}</h5>
        <div>{{ message }}</div>
        <nav class="right-align no-space">
            <button class="transparent link">キャンセル</button>
            <button class="transparent link">確定</button>
        </nav>
    </dialog>
</template>