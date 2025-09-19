<script setup lang="ts">

import { useAuthSignin } from '../composables/authSignIn'

import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();
const { sub: userSub } = useAuthSignin();

const props = defineProps<{
    nickName?: string | null | undefined,
}>();

const emits = defineEmits<{
    (e: 'confirm'): void
}>()

const userWrite = reactive({
    nickname: props.nickName ?? "",
})

const errorMessage = computed(() => {
    if (userWrite.nickname.length === 0) {
        return {
            nickName: "ニックネームを入力してください",
        }
    }
    return {
        nickName: null,
    }
})

const writeUserNickName = async () => {
    if (!userSub.value) return

    await client.models.User.create({
        id: userSub.value,
        nickName: userWrite.nickname,
    });
    // console.log("Userテーブルに新規作成しました");
    emits("confirm")
}


</script>
<template>
    <dialog class="active">
        <!-- <h5>Write User</h5> -->
        <!-- <hr> -->
        <p>使用するニックネームを入力してください</p>
        <div class="field border" :class="{ invalid: errorMessage.nickName }">
            <input type="text" v-model="userWrite.nickname">
            <span class="error">{{ errorMessage.nickName }}</span>
            <!-- <span class="helper">※レビュー者名として表示されます</span> -->
        </div>
        <div class="fl">
            <button class="responsive" @click="writeUserNickName">登録</button>
        </div>
    </dialog>
</template>

<style scoped>
.w-max {
    width: max-content;
}

.overlay {
    z-index: 10;
}
</style>