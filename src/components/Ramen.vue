<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import ReviewCreateDialog from './ReviewCreateDialog.vue';
import ProfileBox from './ProfileBox.vue';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue';
// import { toMask } from '@/utils';
// import StarRating from './StarRating.vue';
import { useAuthSignin } from '../composables/authSignIn'
import UserWriteDialog from './UserWriteDialog.vue';
import ReviewCard from './ReviewCard.vue';
import ReviewViewerDialog from './ReviewViewerDialog.vue';

const { user, route, signOut } = useAuthenticator(); // 認証状態とユーザーを監視

const client = generateClient<Schema>();

const { existing: userExisting, sub: userSub, userInfo, loadUserInfo } = useAuthSignin();

// create a reactive reference to the array of todos
const reviews = ref<Array<Schema['RamenReview']["type"]>>([]);

const dialog = reactive({
    menu: false,
    reviewCreate: false,
    nickNameWrite: false,
    reviewViewer: false,
})

const selectedReview = ref<Schema['RamenReview']["type"] | null>(null);

const loading = ref(false);

// ユーザーがサインイン状態になったら User テーブルをチェック/作成
watch(userExisting, async (_ex_value) => {
    if (_ex_value === true) return; // 既に存在しているならスキップ

    dialog.nickNameWrite = true;
});

const toggleMenu = () => {
    dialog.menu = !dialog.menu;
}

function listReviews() {
    loading.value = true;
    client.models.RamenReview.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
            reviews.value = items
            if (isSynced) {
                loading.value = false;
            }
        },
    });
}

//
const openReviewDialog = (): void => {
    dialog.reviewCreate = true
}
const closeReviewCreateDialog = (): void => {
    dialog.reviewCreate = false
}

const closeReviewViewerDialog = (): void => {
    dialog.reviewViewer = false
}
const onConfirmCreateReview = () => {
    listReviews();
    closeReviewCreateDialog();
}
const onDeleteReview = () => {
    listReviews();
    closeReviewViewerDialog();
}
const onConfirmWriteNickName = () => {
    loadUserInfo();
    dialog.nickNameWrite = false;
}

const onClickReview = (review: Schema['RamenReview']["type"]) => {
    selectedReview.value = review;
    dialog.reviewViewer = true;
}

onMounted(() => {
    listReviews();
});

</script>

<template>
    <div class=" ramen-reviewer">
        <template v-if="dialog.menu">
            <div class="overlay active" @click="toggleMenu"></div>
            <dialog class="left scroll small active">
                <div class="fl j-b">

                    <button class="right-round deep-orange8" @click="signOut">
                        <i>logout</i>
                        <span>Sign Out</span>
                    </button>
                    <button class="link transparent extend mt-0 pt-0 small" @click="toggleMenu">
                        <i>close</i>
                    </button>
                </div>

                <hr class="my-2">
                <ProfileBox v-if="userInfo" :userInfo="userInfo" @reload="dialog.nickNameWrite = true" />
            </dialog>
        </template>

        <header>
            <div class="fl gap-1">
                <button class="link transparent extend ml-0 pl-0 small" id="menu-toggle-button" @click="toggleMenu">
                    <i>menu</i>
                </button>
                <div class="fl">
                    <img src="/ramen.svg" alt="">
                    <b>Ramen Reviewer</b>
                </div>
                <ProfileBox v-if="userInfo" class="ml-auto" :userInfo="userInfo"
                    @reload="dialog.nickNameWrite = true" />

            </div>
        </header>

        <main class="scroller">
            <template v-if="reviews.length > 0">
                <ReviewCard v-for="review in reviews" :key="review.id" :review="review"
                    @click="onClickReview(review)" />
            </template>
            <p class="center" v-else-if="!loading">まだレビューは無いようです。最初のレビューを追加してみてください！</p>
            <p class="center" v-else>
            <div class="shape loading-indicator extra">
                <img class="responsive" src="../assets/ramen.svg" alt="Loading..." />
            </div>
            <p>Loading...</p>
            </p>

            <button class="square extra adder" @click="openReviewDialog">
                <i>add</i>
            </button>
        </main>
        <footer>
            <p>This is ramen reviewer. 2025</p>
        </footer>
    </div>

    <!-- dialog -->
    <div class="overlay active" v-if="dialog.reviewCreate || dialog.nickNameWrite || dialog.reviewViewer">
    </div>
    <ReviewCreateDialog v-if="dialog.reviewCreate && userInfo" :userInfo="userInfo" @close="closeReviewCreateDialog"
        @confirm="onConfirmCreateReview" />
    <UserWriteDialog v-if="dialog.nickNameWrite" :nickName="userInfo?.nickName" @confirm="onConfirmWriteNickName" />
    <ReviewViewerDialog v-if="dialog.reviewViewer && selectedReview" :review="selectedReview"
        @close="dialog.reviewViewer = false" @delete="onDeleteReview" />
</template>

<style scoped>
header {
    border-bottom: solid 1px #555;
}

main {
    max-width: 800px;
    margin: 0 auto;

    &.scroller {
        height: 80vh;
    }
}

#menu-toggle-button {
    left: -1rem;
}

.adder {
    position: fixed;
    bottom: 5%;
    right: 5%;
    z-index: 1;
}
</style>