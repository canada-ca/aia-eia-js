<template>
  <div class="results">
    <!--<PrintButton />-->
    <h1>{{ $t("resultTitle") }}</h1>

    <p>{{ $t("onThisPage") }}</p>
    <ul>
      <li>
        <a href="#score">{{ $t("riskLevel") }}</a>
      </li>
      <li>
        <a href="#obligations">{{ $t("requirements.title") }}</a>
      </li>
      <li>
        <a href="#mitigationMeasures">{{ $t("resultSectionMeasure") }}</a>
      </li>
      <li>
        <a href="#qA">{{ $t("resultSectionQA") }}</a>
        <ul>
          <li>
            <a href="#projectDetails">{{ $t("resultSectionPD") }}</a>
          </li>
          <li>
            <a href="#riskQA">{{ $t("resultSectionRQA") }}</a>
          </li>
          <li>
            <a href="#mitigationQA">{{ $t("resultSectionMQA") }}</a>
          </li>
        </ul>
      </li>
    </ul>

    <Score />
    <Obligations />

    <div class="container-fluid">
      <div class="row">
        <h2 id="mitigationMeasures">{{ $t("resultSectionMeasure") }}</h2>
      </div>
      <div class="row">
        <p v-for="result in myResults[3]" :key="result.name">
          {{ $t(result.name) }}
        </p>
      </div>

      <div class="row">
        <h2 id="qA">{{ $t("resultSectionQA") }}</h2>
      </div>

      <div class="row">
        <h3 id="projectDetails">{{ $t("resultSectionPD") }}</h3>
      </div>
      <div class="row" v-for="result in myResults[0]" :key="result.name">
        <Result :data="result"></Result>
      </div>

      <div class="row">
        <h3 id="riskQA">{{ $t("resultSectionRQA") }}</h3>
      </div>
      <div class="row" v-for="result in myResults[1]" :key="result.name">
        <Result :data="result"></Result>
      </div>

      <div class="row">
        <h3 id="mitigationQA">{{ $t("resultSectionMQA") }}</h3>
      </div>
      <div class="row" v-for="result in myResults[2]" :key="result.name">
        <Result :data="result"></Result>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import Score from "@/components/Score.vue";
import Result from "@/components/Result.vue";
import Obligations from "@/components/Obligations.vue";
import i18n from "@/plugins/i18n";

@Component({
  components: {
    Result,
    Score,
    Obligations
  },
  computed: {
    score: function() {
      return this.$store.getters.calcscore;
    }
  }
})
export default class Results extends Vue {
  myResults = this.$store.getters.resultDataSections;
}
</script>
