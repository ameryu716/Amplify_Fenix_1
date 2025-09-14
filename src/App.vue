<script setup lang="ts">
// import Todos from './components/Todos.vue'

import "@aws-amplify/ui-vue/styles.css";
import Ramen from './components/Ramen.vue';
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { toRefs, watch } from 'vue';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue';
const auth = useAuthenticator();


</script>

<template>
  <Ramen v-if="auth.route === 'authenticated'" />
  <div class="fl cl j-c h-100 amplify-authenticator" v-else>
    <authenticator></authenticator>
  </div>
</template>


<style scoped>
.h-100 {
  height: 100vh;
}

.amplify-authenticator {
  :deep(.amplify-input) {
    color: #222 !important;
  }
}
</style>
<style>
.amplify-input {
  color: #222 !important;

  &:is(:-webkit-autofill, :autofill) {
    /* color: #163514; */
    -webkit-text-fill-color: #163514 !important;
  }
}
</style>