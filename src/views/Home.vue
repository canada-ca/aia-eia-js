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

    
    <HelpModal />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as Survey from "survey-vue";
import showdown from "showdown";
import DropDown from "@/components/DropDown.vue";
import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import Score from "@/components/Score.vue";
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import HelpModal from "@/components/HelpModal.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import { RootState } from "@/types";
import surveyJSON from "@/survey-enfr.json";

Survey.Serializer.addProperty("question", "help:text");

@Component({
  components: {
    AssessmentTool,
    ActionButtonBar,
    DropDown,
    Score,
    HelpModal,
  },
})
export default class Home extends Vue {
  Survey: Survey.Model = new Survey.Model(surveyJSON);
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
    var surveyWithExtraData:any = this.Survey;
    surveyWithExtraData.version = $event.version;
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    surveyWithExtraData.translationsOnResult = $event.translationsOnResult;
    this.Survey.start();
    this.$store.commit("updateResult", this.Survey);
  }  

  created() {
    //Accounts for user's pressing the back button after completing survey (otherwise next button would appear on the last page)
    this.Survey.onAfterRenderQuestion.add((result: any) => {
      this.$store.commit("updateResult", result);
    });

    this.Survey.onComplete.add((result: any) => {
      this.$store.commit("updateResult", result);
    });

    this.Survey.onComplete.add((result: any) => {
      this.$router.push("Results");
    });

    this.Survey.onAfterRenderPage.add((result: { currentPageNo: number; }) => {
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

    this.Survey.onValueChanged.add((result: any) => {
      this.$store.commit("updateResult", result);
      if (this.Survey.getValue("projectDetailsPhase") != undefined) {
        this.allowDropdown = true;
      }
    });

    const converter = new showdown.Converter();

    this.Survey.onTextMarkdown.add(function (survey:any, options:any) {
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
    this.Survey.onAfterRenderQuestion.add((sender:any, options:any) => {
      let title = options.htmlElement.getElementsByTagName("H5")[0];
      let helpButton = "";

      if (title) {
        var questionRequiredHTML = "";

        if (options.question.isRequired) {
          // Should do localization mechanism
          var requiredText = sender.locale == "fr" ? "obligatoire" : "required";
          questionRequiredHTML =
            ' <strong class="required">(' + requiredText + ")</strong>";
        }

        if (options.question.help) {
          let helpTxt = sender.locale == "fr" ? String(options.question.help.fr) : String(options.question.help.default);
          helpTxt = helpTxt
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, 'ooooo')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\(/g, '&#40;')
            .replace(/\)/g, '&#41;');
          let showHelpTxt = this.$t("showHelp").toString();
          helpButton = ` <a role="button" onclick="showHelp('${helpTxt}')"><img src="img/icons/show-help.png" alt="${showHelpTxt}"></a>`;
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
          "</label>" +
          helpButton;
      }
    });

    //if survey is in progress reload from store
    if (this.$store.getters.inProgress) {
      this.fileLoaded({
        version: this.$store.state.version,
        currentPage: this.$store.state.currentPageNo,
        data: this.$store.state.toolData,
        translationsOnResult: this.$store.state.translationsOnResult,
      } as SurveyFile);
    }
  }
}
</script>
