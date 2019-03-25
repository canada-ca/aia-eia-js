<template>
  <section :class="alertclass">
    <h2>Current Score {{ score }}</h2>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex";
import { Model } from "survey-vue";

@Component({
  computed: {
    score: function() {
      return this.$store.getters.calcscore;
    },
    alertclass: function() {
      const score = this.$store.getters.calcscore;
      if (score <= 18) return "alert alert-success";
      if (score >= 19 && score < 36) return "alert alert-warning";
      if (score >= 36) return "alert alert-danger";
    }
  }
})
export default class Score extends Vue {}
</script>
