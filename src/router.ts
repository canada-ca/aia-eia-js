import Vue from "vue";
import Router from "vue-router";
import Results from "./views/Results.vue";
import Questions from "./views/Questions.vue";
import Home from "./views/Home.vue";
import SectionResults from "./views/SectionResults.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/questions",
      name: "questions",
      component: Questions
    },
    { path: "/sections", name: "sections", component: Results },
    {
      path: "/results",
      name: "results",
      component: Results
    },
    { path: "*", name: "notFound", component: Home }
  ]
});
