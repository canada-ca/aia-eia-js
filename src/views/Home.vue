<template>
  <div class="home">
    <h1>{{ $t("appTitle") }}</h1>
    <p>
      <a
        class="btn btn-default pull-right"
        role="button"
        :href="$t(linkProjectAnchor)"
      >
        {{ $t("linkProjectText") }}
      </a>
    </p>

    <div class="alert alert-info">
      <p class="small">{{ $t("localSaveWarning") }}</p>
    </div>

    <form>
      <ActionButtonBar
        v-on:fileLoaded="fileLoaded($event)"
        v-on:startAgain="startAgain"
        :survey="Survey"
      />
    </form>

    <DropDown :survey="Survey" :displayDropDown="allowDropdown" />
    <br />
    <AssessmentTool :survey="Survey" />
    <Score />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import showdown from "showdown";
import DropDown from "@/components/DropDown.vue";
import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import Score from "@/components/Score.vue";
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import { RootState } from "@/types";
import surveyJSON from "@/survey-enfr.json";

@Component({
  components: {
    AssessmentTool,
    ActionButtonBar,
    DropDown,
    Score
  }
})
export default class Home extends Vue {
  Survey: Model = new Model(surveyJSON);
  //Default always set to false
  allowDropdown: boolean = false;

  startAgain() {
    this.Survey.clear(true, true);
    window.localStorage.clear();
    this.$store.commit("resetSurvey");
    //Resets toggle back to false
    this.allowDropdown = false;
  }
  fileLoaded($event: SurveyFile) {
    this.Survey.version = $event.version;
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.translationsOnResult = $event.translationsOnResult;
    this.Survey.start();
    this.$store.commit("updateResult", this.Survey);
  }

  created() {
    //Accounts for user's pressing the back button after completing survey (otherwise next button would appear on the last page)
    this.Survey.onAfterRenderQuestion.add(result => {
      this.$store.commit("updateResult", result);
    });

    this.Survey.onComplete.add(result => {
      this.$store.commit("updateResult", result);
    });

    this.Survey.onComplete.add(result => {
      this.$router.push("Results");
    });

    this.Survey.onAfterRenderPage.add(result => {
      var progressBar = document.getElementsByClassName("progress-bar")[0];
      //Make sure that the current page is 0 and the progress bar is defined and displayed on the screen
      if (result.currentPageNo == 0 && progressBar != undefined) {
        progressBar.innerHTML = "Page 1 " + this.$t("pageProgressBar");
      }
      //Increment the current page by one
      else {
        if (progressBar.innerHTML != undefined) {
          progressBar.innerHTML =
            "Page " + (result.currentPageNo + 1) + this.$t("pageProgressBar");
        }
      }
      //Checks to see weather item1 = Design or item2 = implementation is checked
      //If so then we change boolean to true and pass that parameter to DropDown.vue to check.
      if (this.Survey.getValue("projectDetailsPhase") != undefined) {
        this.allowDropdown = true;
      }
    });

    this.Survey.onValueChanged.add(result => {
      this.$store.commit("updateResult", result);
      if (this.Survey.getValue("projectDetailsPhase") != undefined) {
        this.allowDropdown = true;
      }
    });

    const converter = new showdown.Converter();

    this.Survey.onTextMarkdown.add(function(survey, options) {
      //convert the markdown text to html
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

    this.Survey.onAfterRenderQuestion.add(function(sender, options) {
      if (!options.question.help) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-info btn-xs";

      btn.style.position = "absolute";
      btn.style.marginLeft = "20px";

      btn.innerHTML = "(Show help)";
      var question = options.question;
      btn.onclick = function() {
        document.getElementById("questionDescriptionText")
        .innerHTML = question.help.default;
    document.getElementById("questionDescriptionPopup").modal();
      };

      var header = options.htmlElement.querySelector("h5");
      if (!header) header = options.htmlElement;
      var span = document.createElement("span");
      span.innerHTML = "  ";
      header.appendChild(span);
      header.appendChild(btn);
    });

    //if survey is in progress reload from store
    if (this.$store.getters.inProgress) {
      this.fileLoaded({
        version: this.$store.state.version,
        currentPage: this.$store.state.currentPageNo,
        data: this.$store.state.toolData,
        translationsOnResult: this.$store.state.translationsOnResult
      } as SurveyFile);
    }
  }
}
</script>
