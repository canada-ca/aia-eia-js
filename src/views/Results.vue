<template>
  <div class="home">
    <h1>Algorithmic Impact Assessment Results</h1>
    <Score />
    <AssessmentTool :survey="Survey" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import Score from "@/components/Score.vue";
import surveyJSON from "../survey.json";

@Component({
  components: {
    AssessmentTool,
    Score
  }
})
export default class Home extends Vue {
  readonly Survey: Model = new Model(surveyJSON);
  mounted() {
    this.Survey.data = this.$store.getters.toolData;
    this.Survey.mode = "display";
  }
}
</script>
