<template>
  <div class="results">
    <!--<PrintButton />-->
    <h1>{{ $t("resultTitle") }}</h1>
    <Score />
    <Obligations />

    <div class="container-fluid">

      <ul class="list-unstyled">
        <li>
          <details>
            <summary>{{ $t("resultSectionMeasure") }}</summary>
            <div class="row" v-for="result in myResults[3]" :key="result.name">
              <Result :data="result"></Result>
            </div>
          </details>
        </li>
        <li>
          <details>
            <summary>{{ $t("resultSectionQA") }}</summary>
            <ul class="list-unstyled">
              <li>
                <details>
                  <summary>{{ $t("resultSectionPD") }}</summary>
                  <div
                    class="row"
                    v-for="result in myResults[0]"
                    :key="result.name"
                  >
                    <Result :data="result"></Result>
                  </div>
                </details>
              </li>
              <li>
                <details>
                  <summary>{{ $t("resultSectionRQA") }}</summary>
                  <div
                    class="row"
                    v-for="result in myResults[1]"
                    :key="result.name"
                  >
                    <Result :data="result"></Result>
                  </div>
                </details>
              </li>
              <li>
                <details>
                  <summary>{{ $t("resultSectionMQA") }}</summary>
                  <div
                    class="row"
                    v-for="result in myResults[2]"
                    :key="result.name"
                  >
                    <Result :data="result"></Result>
                  </div>
                </details>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import Score from "@/components/Score.vue";
import Result from "@/components/Result.vue";
import Obligations from "@/components/Obligations.vue";
import i18n from "@/plugins/i18n";

@Component({
  components: {
    Result,
    Score,
    Obligations
  },
  computed: {
    score: function() {
      return this.$store.getters.calcscore;
    }
  }
})
export default class Results extends Vue {
  myResults = this.$store.getters.resultDataSections;
}
</script>
