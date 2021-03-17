<template>
  <div
    class="card"
    img-top
    style="min-width: 30rem; margin-top: 15px; margin-bottom: 5px;"
    v-on:click="goToSection(section.name)"
    :survey="survey"
    v-bind:style="cardStyles"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <i
      :class="setIconClass(icon)"
      style="margin-top: 20px; margin-left: 25px;"
    ></i>
    <div class="card-body">
      <h2 class="card-title">{{ section.title }}</h2>
      <p style="font-size: 16px" class="card-text">
        {{ section.description }}
      </p>
    </div>
    <div class="card-footer">This section's status</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { PageModel, SurveyModel } from "survey-vue";

@Component({
  data: function() {
    return {
      cardStyleHover: {
        border: "1px solid black",
        "box-shadow":
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        cursor: "pointer"
      },
      cardStyle: {
        "box-shadow":
          "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)"
      },
      hover: false
    };
  },
  computed: {
    cardStyles() {
      if (this.$data.hover == true) {
        return this.$data.cardStyleHover;
      } else {
        return this.$data.cardStyle;
      }
    }
  },
  methods: {
    setIconClass(icon: string) {
      let classDef: string = "fas fa-" + icon + " fa-3x";
      return classDef;
    }
  }
})
export default class HomeSectionCard extends Vue {
  @Prop() public section!: PageModel;
  @Prop() public survey!: SurveyModel;
  @Prop() public icon!: string;

  goToSection(sectionName: string) {
    this.survey.currentPage = sectionName;
    this.$store.commit("updateSurveyData", this.survey);
    this.$store.commit("updateCurrentPageName", sectionName);
    this.$router.push("/questions");
  }
}
</script>

<style scoped>
h2 {
  font-size: 1.2em !important;
}
</style>
