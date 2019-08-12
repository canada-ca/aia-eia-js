<style>
.scoreClass {
  font-size: 0.8em !important;
}
</style>
<template>
  <b-navbar toggleable="lg" type="dark" variant="info" :sticky="true" fixed="bottom">
    <b-navbar-brand href="#">AIA SCORE</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>

      <b-container>
        <b-row :class="alertclass" :no-gutters="true">
          <b-col>{{ $t("riskLevel") }}: {{ score[3] }}</b-col>
          <b-col>{{ $t("currentScore") }}: {{ score[2] }}</b-col>
          <b-col>{{ $t("rawRiskScore") }}: {{ score[0] }}</b-col>
          <b-col>{{ $t("mitigationScore") }}: {{ score[1] }}</b-col>
        </b-row>
      </b-container>

    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex";

@Component({
  computed: {
    score: function() {
      return this.$store.getters.calcScore;
    },
    alertclass: function() {
      const score = this.$store.getters.calcScore[3];
      if (score === undefined || score === 1) return "scoreClass alert alert-success";
      if (score === 2) return "scoreClass alert alert-info";
      if (score === 3) return "scoreClass alert alert-warning";
      if (score === 4) return "scoreClass alert alert-danger";
      /*const score = this.$store.getters.calcScore[2];
      if (score <= 18) return "alert alert-success";
      if (score > 18 && score <= 36) return "alert alert-info";
      if (score > 36 && score <= 54) return "alert alert-warning";
      if (score > 54) return "alert alert-danger";*/
    }
  }
})
export default class Score extends Vue {}
</script>
