import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import { ref, onMounted, onUnmounted, toRefs, watch } from "vue";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// by convention, composable function names start with "use"
export function useAuthSignin() {
    const client = generateClient<Schema>();
    const { user } = useAuthenticator();

    const existing: any = ref(null);
    const sub = ref(null);
    const userInfo = ref<Schema["User"] | null>(null);

    console.log("auth signin composable.");

    const loadUserInfo = () => {
        client.models.User.get({ id: sub.value }).then((user) => {
            userInfo.value = <any>user.data;
        });
    };

    onMounted(async () => {
        console.log("watched: user", user.value);

        // if (newUser) {
        sub.value = user.userId; // Cognitoのsub
        console.log("ログインユーザー:", sub);

        // Userテーブルに存在確認 & 作成
        const _existing = await client.models.User.get({ id: sub.value });
        if (_existing.data) {
            userInfo.value = _existing.data;
            existing.value = true;
            console.log("exisitings");
        } else {
            existing.value = false;
            console.log("not exisitings");
        }
        // }
    });

    // ユーザーがサインイン状態になったら User テーブルをチェック/作成
    // watch(user, async (newUser) => {

    // });

    return { existing, sub, userInfo, loadUserInfo };
}
