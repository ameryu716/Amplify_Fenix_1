<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import StarRating from './StarRating.vue';

const client = generateClient<Schema>();

const props = defineProps<{
    userInfo: Schema['User'],
}>();

const emits = defineEmits<{
    (e: 'close'): void
    (e: 'confirm', value: any): void
}>()

const confirming = ref(false);

const inputModel = reactive({
    title: "",
    content: "",
    star: 0,
    storeName: "",
})

const errorMessage = reactive({
    title: null,
    content: null,
    star: null,
    storeName: null,
})

const close = () => {
    emits("close");
}

const validate = () => {

    const inputModelAttributes = {
        storeName: "店舗名",
        title: "タイトル",
        content: "内容",
        star: "星評価",
    }

    Object.keys(inputModelAttributes)
        .forEach(key => {

            switch (key) {
                case "title":
                case "content":
                case "storeName":
                    // errorMessage[key] = inputModelAttributes[key];
                    if (!inputModel[key] || inputModel[key].length === 0) {
                        errorMessage[key] = `${inputModelAttributes[key]}を入力してください`;
                    } else {
                        errorMessage[key] = null;
                    }

                    break;
                case "star":
                    if (inputModel[key] === 0) {
                        errorMessage[key] = `☆5段階で評価してください`;
                    } else {
                        errorMessage[key] = null;
                    }
                    break;
            }
        });

    if (Object.values(errorMessage).some(v => v)) return false;

    return true;
}

const onConfirm = () => {

    if (!validate()) return;

    const is_confirm = window.confirm("この内容でレビューを行います。よろしいですか？");
    if (!is_confirm) return;

    confirming.value = true;
    const modelValues = {
        ...inputModel,
        reviewerName: props.userInfo.nickName,
        reviewerId: props.userInfo.id,
    }
    client.models.RamenReview.create(modelValues)
        .then(() => {
            emits("confirm", modelValues);
        })
        .catch((err) => {
            console.error(err);
            // confirming.value = false;
            // alert("レビューの登録に失敗しました。時間をおいて再度お試しください。");
        })
        .finally(() => {
            confirming.value = false;
        });
}

// onMounted(() => {
//     console.log(props.userInfo);
// })


</script>

<template>
    <dialog class="active">
        <h6>レビューを作成しましょう</h6>
        <hr>
        <div class="field label border" :class="{ 'invalid': errorMessage.storeName }">
            <input type="text" v-model="inputModel.storeName">
            <label>Store Name</label>
            <span class="error" v-if="errorMessage.storeName">{{ errorMessage.storeName }}</span>
        </div>
        <div class="field label border" :class="{ 'invalid': errorMessage.title }">
            <input type="text" v-model="inputModel.title">
            <label>Title</label>
            <span class="error" v-if="errorMessage.title">{{ errorMessage.title }}</span>
        </div>
        <div class="field textarea label border" :class="{ 'invalid': errorMessage.content }">
            <textarea v-model="inputModel.content"></textarea>
            <label>Content</label>
            <span class="error" v-if="errorMessage.content">{{ errorMessage.content }}</span>
        </div>
        <div class="field border input-field input-field-star">
            <!-- <label>Star</label> -->
            <div class="fl">
                <StarRating v-model="inputModel.star" />
                <b class="ml-2">{{ inputModel.star }}</b>
            </div>
            <span class="error" v-if="errorMessage.star">{{ errorMessage.star }}</span>
        </div>
        <nav class="right-align no-space">
            <button class="transparent link text-gray" @click="close">キャンセル</button>
            <button class="transparent link extra" @click="onConfirm">
                <i v-if="confirming">
                    <div class="shape loading-indicator max"></div>
                </i>
                <span>登録</span>
            </button>
        </nav>
    </dialog>
</template>

<style scoped>
.input-field {
    &.input-field-star {
        b {
            font-size: 1rem;
        }
    }
}

dialog {
    width: 90%;
    max-width: 600px;
    /* height: 300px; */
}

h6 {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
}

.textarea {
    height: 200px;
}
</style>