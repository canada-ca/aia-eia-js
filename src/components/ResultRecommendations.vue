<template>
  <div>
    <b-card-body>
      <div v-for="recommendation in myRecommendations" :key="recommendation.id">
        <div v-for="rec in recommendation" :key="rec.id">
          <div v-if="rec.name == sectionName">
            {{ rec.recommendations[sectionScoreLevel].title.en }}
          </div>
        </div>
      </div>
    </b-card-body>
  </div>
</template>
<script lang="ts">
import i18n from "@/plugins/i18n";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Recommendations } from "@/types";
@Component({
  components: {
    ResultRecommendations
  },
  computed: {
    locale() {
      return i18n.locale;
    }
  },
  methods: {}
})
export default class ResultRecommendations extends Vue {
  @Prop() public myRecommendations!: Recommendations;
  @Prop() public sectionName!: string;
  @Prop() public sectionScoreLevel!: number;
}
</script>
