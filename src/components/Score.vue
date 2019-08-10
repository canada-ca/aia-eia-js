<style>
.above-fold {
  position: fixed;
  top: 50%;
  right: 0;
  border: 2px solid #4CAF50;
  width: 230px;
  z-index: 1000;
}
.above-fold-fr {
  width: 280px !important;
}
p {
  float: right;
}
</style>
<template>
  <section :class="alertclass" id="score">
    <p>{{ $t("riskLevel") }} {{ score[3] }}</p>
    <p>{{ $t("currentScore") }} {{ score[2] }}</p>
    <p>{{ $t("rawRiskScore") }} {{ score[0] }}</p>
    <p>{{ $t("mitigationScore") }} {{ score[1] }}</p>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex";
import { Model } from "survey-vue";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";

let scorePanel = "above-fold";
let Survey: Model = new Model(surveyJSON);
Survey.locale = i18n.locale;
if (Survey && Survey.locale) {
  scorePanel += " above-fold-fr"
}

@Component({
  computed: {
    score: function() {
      return this.$store.getters.calcScore;
    },
    alertclass: function() {
      props: {
        scorePanel: String
      }
      const score = this.$store.getters.calcScore[3];
      if (score === undefined || score === 1) return scorePanel + " alert alert-success";
      if (score === 2) return scorePanel + " alert alert-info";
      if (score === 3) return scorePanel + " alert alert-warning";
      if (score === 4) return scorePanel + " alert alert-danger";
      /*const score = this.$store.getters.calcScore[2];
      if (score <= 18) return "alert alert-success";
      if (score > 18 && score <= 36) return "alert alert-info";
      if (score > 36 && score <= 54) return "alert alert-warning";
      if (score > 54) return "alert alert-danger";*/
    }
  }
})
export default class Score extends Vue {
  created() {
    Survey.locale = i18n.locale;
    if (Survey && Survey.locale) {
      scorePanel += " above-fold-fr"
    }
  }
}
</script>
