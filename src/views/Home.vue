<template>
  <div class="home">
    <h1>{{ $t("appTitle") }}</h1>
    <p>
      <a href="https://github.com/canada-ca/aia-eia-js">{{
        $t("linkProjectText")
      }}</a>
    </p>
    <form>
      <input type="button" class="btn btn-primary" value="Save" v-on:click="save"/>
      <input type="button" class="btn btn-primary" value="Load"/>
    </form>
    <AssessmentTool :survey="Survey" />
    <Score />
    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import Score from "@/components/Score.vue";
import { RootState } from "../types";
import surveyJSON from "../survey-enfr.json";
import showdown from "showdown";
import i18n from "@/plugins/i18n";

@Component({
  components: {
    AssessmentTool,
    Score
  }
})
export default class Home extends Vue {
  readonly Survey: Model = new Model(surveyJSON);
  save() { 
    const data = JSON.stringify(this.$store.getters.plainData);
    const blob = new Blob([data], {type: 'text/plain'})
    const e = document.createEvent('MouseEvents');
    const a = document.createElement('a');
    a.download = "test.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initEvent('click', true, false);
    a.dispatchEvent(e);
  }
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

    // Set locale
    this.Survey.locale = i18n.locale;

    // Remove the default required '*'.
    this.Survey.requiredText = "";

    // Fix all the question labels as they're using <H5> instead of <label>
    // as SurveyJS has open issue as per: https://github.com/surveyjs/surveyjs/issues/928
    this.Survey.onAfterRenderQuestion.add(function(sender, options) {
      let title = options.htmlElement.getElementsByTagName("H5")[0];
      if (title) {
        var questionRequiredHTML = "";

        if (options.question.isRequired) {
          // Should do localization mechanism
          var requiredText = sender.locale == "fr" ? "obligatoire" : "required";
          questionRequiredHTML =
            ' <strong class="required">(' + requiredText + ")</strong>";
        }

        title.outerHTML =
          '<label for="' +
          options.question.inputId +
          '" class="' +
          title.className +
          '"><span class="field-name">' +
          title.innerText +
          "</span>" +
          questionRequiredHTML +
          "</label>";
      }
    });
  }
}
</script>
