<script setup lang="ts">
// const reviews = ref<Array<Schema['RamenReview']["type"]>>([]);
import StarRating from './StarRating.vue';
import type { Schema } from '../../amplify/data/resource';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const props = defineProps<{
    review: Schema['RamenReview']["type"],
}>();

const shortedContent = computed(() => {
    if (!props.review || !props.review.content) return { content: "", is_over: false };
    const shorted_border = 130;
    let _is_over = false;
    let _content = props.review.content;

    if (_content.length > shorted_border) {
        _content = _content.slice(0, shorted_border) + '...';
        _is_over = true;
    }

    return {
        content: _content,
        is_over: _is_over,
    };
});

</script>
<template>
    <article class="border">
        <div class="fl">
            <i>store</i>
            <b class="ml-1">{{ review.storeName }}</b>
            <span class="ml-auto italic">By {{ review.reviewerName }}</span>
        </div>
        <h6>{{ review.title }}</h6>
        <p :class="{ 'over': shortedContent.is_over }">{{ shortedContent.content }}</p>
        <div class="fl">
            <StarRating :modelValue="review.star" readonly />
            <b class="ml-1">{{ review.star }}</b>
        </div>
    </article>
</template>

<style scoped>
h6 {
    margin-block-start: 0.5rem;
    font-size: 1.3rem;
}

p {
    margin-block-start: 0.5rem;
    border-radius: 0;

    &.over {
        /* text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap; */
        max-height: 4.5em;
        /* 3行分の高さ */
        overflow: hidden;
        position: relative;

        &::after {
            content: '';
            display: block;
            position: absolute;
            bottom: 0;
            right: 0;
            /* background: white; */
            width: 100%;
            height: 30px;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(18, 18, 18, 0.75) 70%, rgba(18, 18, 18, 1));
            color: rgb(16, 20, 19);
        }
    }
}
</style>