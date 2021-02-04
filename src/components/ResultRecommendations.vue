<template>
  <div>
    <b-card-body>
      <p>
        {{
          getRecommendation(sectionRecommendations, sectionName, "0").title[
            locale
          ]
        }}
      </p>
    </b-card-body>
  </div>
</template>
<script lang="ts">
import { SectionRecommendation } from "@/types.ts";
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
  components: {
    ResultRecommendations
  },
  computed: {},
  methods: {
    /**
     * Gets the recommendations based on the section name provided and the level achieved in the section
     */
    getRecommendation(
      sectionRecommendations: SectionRecommendation[],
      sectionName: string,
      scoreLevel: string
    ) {
      let sectionRec = sectionRecommendations.find(section => {
        return section.name == sectionName;
      });
      return sectionRec?.recommendations[parseInt(scoreLevel)];
    }
  }
})
export default class ResultRecommendations extends Vue {
  @Prop() public sectionRecommendations?: SectionRecommendation;
  @Prop() public sectionName!: string;
  @Prop() public sectionScoreLevel!: number;
  @Prop() public locale!: any;
}
</script>
