<style>
.scoreClass {
  font-size: 0.8em !important;
  display: flex !important;
}
.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  bottom: 0;
}
</style>
<template>
  <b-container class="sticky">
    <b-row :class="alertclass" :no-gutters="true" v-if="!isMobile()">
      <b-col>{{ $t("riskLevel") }}: {{ score[3] }}</b-col>
      <b-col>{{ $t("currentScore") }}: {{ score[2] }}</b-col>
      <b-col>{{ $t("rawRiskScore") }}: {{ score[0] }}</b-col>
      <b-col>{{ $t("mitigationScore") }}: {{ score[1] }}</b-col>
    </b-row>
    <b-row :class="alertclass" :no-gutters="true" v-if="isMobile()">
      <b-col>{{ $t("IL") }}: {{ score[3] }}</b-col>
      <b-col>{{ $t("CS") }}: {{ score[2] }}</b-col>
      <b-col>{{ $t("RS") }}: {{ score[0] }}</b-col>
      <b-col>{{ $t("MS") }}: {{ score[1] }}</b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex";

// define a mixin object
var myMixin = {
  methods: {
    isMobile: function() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};

@Component({
  mixins: [myMixin],
  computed: {
    score: function() {
      return this.$store.getters.calcScore;
    },
    alertclass: function() {
      const score = this.$store.getters.calcScore[3];
      if (score === undefined || score === 1)
        return "scoreClass alert alert-success";
      if (score === 2) return "scoreClass alert alert-info";
      if (score === 3) return "scoreClass alert alert-warning";
      if (score === 4) return "scoreClass alert alert-danger";
    }
  }
})
export default class Score extends Vue {}
</script>
