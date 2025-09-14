<script setup lang="ts">

import { useAuthSignin } from '../composables/authSignIn'

import { onMounted, reactive, ref, watch } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();
const { sub: userSub } = useAuthSignin();

const props = defineProps<{
    nickName: string,
}>();

const emits = defineEmits<{
    (e: 'confirm'): void
}>()

const userWrite = reactive({
    nickname: props.nickName ?? "",
})

const writeUserNickName = async () => {


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
        <div class="field border">
            <input type="text" v-model="userWrite.nickname">
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