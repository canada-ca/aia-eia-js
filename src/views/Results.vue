<template>
  <div class="results">
    <h1>{{ $t("resultTitle") }}</h1>

    <BaseNavigation v-on:exportResults="exportResults" />

    <form>
      <ActionButtonBar
        v-on:fileLoaded="fileLoaded($event)"
        v-on:startAgain="startAgain"
      />
    </form>

    <div v-for="section in $store.state.sections" :key="section.id">
      <ResultsCard
        v-if="section.enabled"
        :section="section"
        :section-name="section.sectionName"
        :questions-names="section.questionsNames"
        :user-score="section.userScore"
        :questions="section.questions"
        :my-recommendations="myRecommendations"
        :locale="locale"
      />
    </div>
    <div class="row" style="padding: 0 5px">
      <div class="col-3 col-sm-2 col-md-3">
        <button
          type="button"
          class="btn survey-button"
          style="width: inherit"
          v-on:click="goToHomePage()"
        >
          {{ $t("navigation.chooseAnotherSection") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Model } from "survey-vue";
import showdown from "showdown";
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import ResultsContainer from "@/components/ResultsContainer.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import ResultsCard from "@/components/ResultsCard.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";

@Component({
  components: {
    ActionButtonBar,
    ResultsContainer,
    ResultsCard,
    BaseNavigation
  },
  computed: {
    sectionNames: function() {
      return this.$store.getters.returnSectionsNames;
    },
    results() {
      return this.$store.getters.resultsDataSections;
    },
    sections() {
      return this.$store.getters.returnAllSections;
    },
    myRecommendations() {
      return this.$store.state.recommendations;
    },
    locale() {
      return this.$i18n.locale;
    }
  }
})
export default class Results extends Vue {
  @Prop() data: any;
  myResults = this.$store.getters.resultsDataSections;

  Survey: Model = new Model(surveyJSON);
  goToHomePage() {
    this.$store.commit("updateSurveyData", this.Survey);
    this.$router.push("/");
  }
  exportResults() {
    const source = window.document.getElementById(
      this.$i18n.locale + "-content"
    ) as HTMLElement;

    let pageActions = window.document.getElementsByClassName("page-actions");

    function beforePrint() {
      for (let i in pageActions) {
        if (pageActions[parseInt(i)].classList) {
          pageActions[parseInt(i)].classList.add("hidden");
        }
      }
    }

    function afterPrint() {
      for (let i in pageActions) {
        if (pageActions[parseInt(i)].classList) {
          pageActions[parseInt(i)].classList.remove("hidden");
        }
      }
    }

    window.addEventListener("beforeprint", beforePrint, false);
    window.addEventListener("afterprint", afterPrint, false);

    window.print();

    window.removeEventListener("beforeprint", beforePrint);
    window.removeEventListener("afterprint", afterPrint);
  }

  startAgain() {
    this.Survey.clear(true, true);
    window.localStorage.clear();
    this.$store.commit("resetSurvey");
    this.$router.push({ path: "/" });
  }
  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.$store.commit("calculateResult", this.Survey);

    this.myResults = this.$store.getters.resultDataSections;
  }

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    this.Survey.locale = value;
    this.Survey.render();
  }

  created() {
    this.Survey.onComplete.add(result => {
      this.$store.commit("updateSurveyData", result);
    });

    this.Survey.onValueChanged.add(result => {
      this.$store.commit("calculateResult", result);
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

    // accessibility fix... aria-labelledby being needlessly generated for html question
    // TODO: make this dynamic by looping over questions and doing this for all html questions
    this.Survey.onAfterRenderQuestion.add(function(sender, options) {
      let welcomePage = document.getElementsByName("welcome1");
      if (welcomePage && welcomePage.length > 0) {
        let welcomePageElement = welcomePage[0];
        welcomePageElement.removeAttribute("aria-labelledby");
      }
    });

    //if survey is in progress reload from store
    if (this.$store.getters.inProgress) {
      this.fileLoaded({
        currentPage: this.$store.state.currentPageNo,
        data: this.$store.state.toolData
      } as SurveyFile);
    }
  }
}
</script>
