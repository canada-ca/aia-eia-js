<template>
  <div class="home">
    <h1>Algorithmic Impact Assessment</h1>
    <Score />
    <AssessmentTool :survey="Survey" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import Score from "@/components/Score.vue";
import { RootState } from "../types";
import surveyJSON from "../survey.json";
import showdown from "showdown";

@Component({
  components: {
    AssessmentTool,
    Score
  }
})
export default class Home extends Vue {
  readonly Survey: Model = new Model(surveyJSON);
  created() {
    this.Survey.onComplete.add(result => {
      this.$store.commit("updateResult", result);
    });

    this.Survey.onComplete.add(result => {
      this.$router.push("Results");
    });

    this.Survey.onValueChanged.add(result => {
      this.$store.commit("updateResult", result);
    });

    const converter = new showdown.Converter();

    this.Survey.onTextMarkdown.add(function(survey, options) {
      //convert the mardown text to html
      var str = converter.makeHtml(options.text);
      //remove root paragraphs <p></p>
      str = str.substring(3);
      str = str.substring(0, str.length - 4);
      //set html
      options.html = str;
    });
  }
}
</script>
