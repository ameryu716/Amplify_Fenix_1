<script setup lang="ts">
import { readonly, ref, watch } from "vue";

const props = defineProps({
    modelValue: {
        type: Number as () => number | null | undefined,
        default: 0,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue"]);

const rating = ref<number>(props.modelValue ?? 0);

// 親から変更された場合に同期
// watch(
//     () => props.modelValue,
//     (newVal) => {
//         rating.value = newVal;
//     }
// );

function setRating(v: number) {
    if (props.readonly) return
    rating.value = v;
    emit("update:modelValue", v);
}
</script>

<template>
    <div class="star-rating" :class="{ 'read-only': props.readonly }">
        <!-- <i v-for="i in 5" :key="i" class="star" :class="{ filled: i <= rating }" @click="setRating(i)">star</i> -->
        <i v-for="i in 5" :key="i" @click="setRating(i)" :class="{ filled: i <= rating }">
            <svg v-show="i > rating" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                width="24px" fill="#e8eaed">
                <path
                    d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
            </svg>
            <svg v-show="i <= rating" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                width="24px" fill="#ffb400">
                <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
            </svg>
        </i>
    </div>
</template>

<style scoped>
.star-rating {
    display: flex;
    gap: 0.15rem;
    font-size: 2rem;
    cursor: pointer;

    /* .star {
        color: #ccc;
    }
        /* transition: color 0.2s; */
    /* デフォルトの星 */

    /* ゴールドっぽい色 */
    /* .star.filled {
        color: #ffb400;
    }  */
    i {
        svg {
            fill: #ccc;
        }

        &.filled {
            svg {
                fill: #ffb400;
            }
        }
    }

    /* svg {
        fill: #ffb400;
    } */

    &.read-only {
        cursor: default;
    }
}
</style>
