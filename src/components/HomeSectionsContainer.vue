<template>
  <div>
    <ul class="card-deck">
      <HomeSectionCard
        v-for="section in sections"
        :key="section.id"
        :section="section"
        :survey="survey"
        :icon="getIcon(section.name, sectionRecommendation)"
      ></HomeSectionCard>
    </ul>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import HomeSectionCard from "@/components/HomeSectionCard.vue";
import { PageModel, SurveyModel } from "survey-vue";
import { SectionRecommendation } from "@/types";

@Component({
  components: { HomeSectionCard },
  methods: {
    getIcon(
      sectionName: string,
      sectionRecommendation: SectionRecommendation[]
    ) {
      let section = sectionRecommendation.find(section => {
        return section.name === sectionName;
      });
      if (section !== undefined) {
        return section.icon;
      } else {
        return "smile";
      }
    }
  }
})
export default class HomeSectionsContainer extends Vue {
  @Prop() public sections!: PageModel[];
  @Prop() public survey!: SurveyModel;
  @Prop() public sectionRecommendation!: SectionRecommendation[];
}
</script>
