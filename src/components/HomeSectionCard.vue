<template>
  <b-card footer="This section's status" img-top style="min-width: 30rem">
    <b-card-header class="row"
      ><i class="fab fa-github fa-2x col" style="width: 10rem"></i>
      <h2 class="col">{{ section.title }}</h2>
    </b-card-header>
    <b-card-text>{{ section.description }} </b-card-text>
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
