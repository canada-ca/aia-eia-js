<template>
  <b-card
    :title="section.title"
    title-tag="h2"
    footer="This section's status"
    img-top
    style="min-width: 30rem"
  >
    <b-card-text
      ><i class="fab fa-github fa-3x"></i>
      <p style="font-size: 16px">
        {{ section.description }}
      </p>
    </b-card-text>
    <button
      type="button"
      class="btn survey-button"
      style="width: inherit"
      v-on:click="goToSection(section.name)"
      :survey="survey"
    >
      {{ $t("navigation.launchThisSection") }}
    </button>
  </b-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { PageModel, SurveyModel } from "survey-vue";

@Component({
  components: {}
})
export default class HomeSectionCard extends Vue {
  @Prop() public section!: PageModel;
  @Prop() public survey!: SurveyModel;

  goToSection(sectionName: string) {
    this.survey.currentPage = sectionName;
    this.$store.commit("updateSurveyData", this.survey);
    this.$router.push("questions");
  }
}
</script>

<style scoped>
h2 {
  font-size: 1.2em !important;
}
</style>
