import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import { ref, onMounted, onUnmounted, toRefs, watch } from "vue";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// by convention, composable function names start with "use"
export function useAuthSignin() {
    const client = generateClient<Schema>();
    const { user } = useAuthenticator();

    const existing: any = ref(null);
    const sub = ref<null | string>(null);
    const userInfo = ref<Schema["User"]["type"] | null>(null);

    console.log("auth signin composable.");

    const loadUserInfo = () => {
        if (!sub.value) throw new Error("subjectId is null");

        client.models.User.get({ id: sub.value }).then((user) => {
            userInfo.value = <any>user.data;
        });
    };

    onMounted(async () => {
        console.log("watched: user", user.value);

        sub.value = user.userId as string; // Cognitoのsub
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
    });

    return { existing, sub, userInfo, loadUserInfo };
}
