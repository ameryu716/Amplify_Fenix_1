import "./stylus/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
// import "beercss/scoped";
import "beercss";
import "material-dynamic-colors";
import "./stylus/override.css";
import "./stylus/lib.css";
await ui("theme", "#F7A240");
import "@/stylus/main.css";

Amplify.configure(outputs);

createApp(App).mount("#app");
