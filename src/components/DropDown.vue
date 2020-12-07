<template>
  <div id="dropDown" v-if="displayDropDown == true">
    <label> {{ $t("navigateSectionLabel") }} </label>

    <div>
      <b-col md="4">
        <!-- Calls redirectToPage function whenever user changes index -->
        <select class="dropDownList" @change="redirectToPage()">
          <option select>{{ $t("selectSection") }} </option>
          <option v-for="page in totalPages" :key="page.num">
            {{ "Section " + page.num + ": " + page.title }}
          </option>
        </select>
      </b-col>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import i18n from "@/plugins/i18n";

@Component
export default class DropDown extends Vue {
  @Prop() public survey?: Model;
  @Prop() displayDropDown?: boolean;

  redirectToPage() {
    //colon value used to determine weather to set new value as single digit number or double digit
    var colon = ":";
    var e = document.getElementsByClassName(
      "dropDownList"
    )[0] as HTMLSelectElement;
    //Used to get selected item
    var pageSection = e.options[e.selectedIndex].text;
    var newVal: any;
    //Using regex (regular expressions)
    newVal = pageSection.replace(/\D/g, "");
    //To redirect to correct page
    if (this.survey != null) {
      this.survey.currentPageNo = newVal - 1;
    }
  }
  data() {
    return {
      totalPages: [
        {
          title: this.$t("resultSectionPD"),
          num: 1
        },
        {
          title: this.$t("sectionBusinessDriverImpact"),
          num: 2
        },
        {
          title: this.$t("riskProfile"),
          num: 3
        },
        {
          title: this.$t("projectAuthority"),
          num: 4
        },
        {
          title: this.$t("aboutTheSystem"),
          num: 5
        },
        {
          title: this.$t("aboutTheAlgorithm"),
          num: 6
        },
        {
          title: this.$t("aboutDecision"),
          num: 7
        },
        {
          title: this.$t("impactAssessment"),
          num: 8
        },
        {
          title: this.$t("aboutTheData"),
          num: 9
        },
        {
          title: this.$t("consultations"),
          num: 10
        },

        {
          title: this.$t("deRiskingAndMitigationMeasuresDQ"),
          num: 11
        },

        {
          title: this.$t("deRiskingAndMitigationMeasuresPF"),
          num: 12
        },
        {
          title: this.$t("deRiskingAndMitigationMeasuresP"),
          num: 13
        }
      ]
    };
  }
}
</script>
