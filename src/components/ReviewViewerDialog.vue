<script setup lang="ts">
// const reviews = ref<Array<Schema['RamenReview']["type"]>>([]);
import StarRating from './StarRating.vue';
import type { Schema } from '../../amplify/data/resource';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useAuthSignin } from '@/composables/authSignIn';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();


const { userInfo } = useAuthSignin();

const props = defineProps<{
    review: Schema['RamenReview']["type"],
}>();

const emits = defineEmits<{
    (e: 'close'): void,
    (e: 'delete'): void
}>()

const isMyReview = computed(() => props.review.reviewerId === userInfo.value?.id);

const del = () => {
    // editMode.value = true;
    const is_confirm = window.confirm("本当に削除しますか？");
    if (!is_confirm) return;

    client.models.RamenReview.delete({ id: props.review.id }).then(() => {
        emits("delete");
    });
}

const close = () => {
    emits("close");
}

</script>
<template>
    <dialog class="active">
        <!-- <article class="border"> -->

        <div class="fl">
            <i>store</i>
            <b class="ml-1">{{ review.storeName }}</b>
        </div>
        <button class="link transparent extend absolute top right" @click="close">
            <i>close</i>
        </button>
        <div class="fl mt-3">
            <span class="ml-auto italic">By {{ review.reviewerName }}</span>
        </div>
        <h6>{{ review.title }}</h6>
        <div class="scroller mb-2">
            <p>{{ review.content }}</p>
        </div>
        <div class="fl">
            <StarRating :modelValue="review.star" readonly />
            <b class="ml-1">{{ review.star }}</b>
        </div>
        <div class="fl j-end" v-if="isMyReview">
            <button class="link transparent text-red-500" @click="del">削除</button>
        </div>
        <!-- </article> -->
    </dialog>
</template>

<style scoped>
h6 {
    margin-block-start: 0.5rem;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
}

p {
    margin-block-start: 0.5rem;
    border-radius: 0;
    white-space: pre-wrap;
}


dialog {
    width: 90%;
    max-width: 600px;
    /* height: 300px; */
}

.scroller {
    max-height: 50vh;
    overflow-y: auto;
    border-radius: 0;
    /* margin-block: 1rem 1.5rem; */
}
</style>