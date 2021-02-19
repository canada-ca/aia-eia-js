<template>
  <div class="results">
    <h1 v-if="this.$router.history.current['path'] == '/Results'">
      {{ $t("resultTitle") }}
    </h1>
    <h1 v-if="this.$router.history.current['path'] == '/sections'">
      {{ $t("sectionResultsTitle") }}
    </h1>

    <BaseNavigation v-on:exportResults="exportResults" />

    <form>
      <ActionButtonBar
        v-on:fileLoaded="fileLoaded($event)"
        v-on:startAgain="startAgain"
      />
    </form>

    <div v-if="this.$router.history.current['path'] == '/Results'">
      <div v-for="section in $store.state.sections" :key="section.id">
        <ResultsCard
          v-if="section.enabled"
          :section="section"
          :section-name="section.sectionName"
          :user-score="section.userScore"
          :max-score="getMaxScore(section)"
          :my-recommendations="myRecommendations"
          :locale="locale"
        />
      </div>
    </div>
    <div v-else-if="this.$router.history.current['path'] == '/sections'">
      <ResultsCard
        v-if="currentSection !== undefined"
        :section="currentSection"
        :section-name="currentSection.sectionName"
        :user-score="currentSection.userScore"
        :max-score="getMaxScore(currentSection)"
        :my-recommendations="myRecommendations"
        :locale="locale"
      />
      <div v-else>
        <p>
          {{ $t("notice.noProgress") }}
        </p>
      </div>
    </div>
    <div class="page-actions">
      <b-row class="no-gutters" align-h="center" style="padding: 0 15px">
        <b-col
          class="col-lg-2 col-sm-5 col-md-3 col-xs-6"
          style="margin: 2px 2px;"
        >
          <button
            type="button"
            class="btn survey-button"
            style="width: inherit"
            v-on:click="goToHomePage()"
          >
            {{ $t("navigation.chooseAnotherSection") }}
          </button>
        </b-col>
        <b-col
          v-if="this.$router.history.current['path'] == '/sections'"
          class="col-lg-2 col-sm-5 col-md-3 col-xs-6"
          style="margin: 2px 2px;"
        >
          <button
            type="button"
            class="btn survey-button"
            style="width: inherit"
            v-on:click="goToAllResults()"
            :key="$route.path"
          >
            {{ $t("navigation.viewAllResults") }}
          </button>
        </b-col>
        <b-col></b-col>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Model } from "survey-vue";
import showdown from "showdown";
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import ResultsCard from "@/components/ResultsCard.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";
import { Section } from "@/types";

@Component({
  components: {
    ActionButtonBar,
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
    currentSection() {
      return this.$store.getters.returnCurrentSection;
    },
    myRecommendations() {
      return this.$store.state.recommendations;
    },
    locale() {
      return this.$i18n.locale;
    }
  },
  methods: {
    getMaxScore(section: Section) {
      let maxScore: number = section.questions.length * 7;
      return maxScore;
    }
  }
})
export default class Results extends Vue {
  @Prop() data: any;
  @Prop() public section!: Section;
  myResults = this.$store.getters.resultsDataSections;

  Survey: Model = new Model(surveyJSON);
  goToHomePage() {
    this.$router.push("/");
  }
  goToAllResults() {
    this.$router.push("/Results");
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
