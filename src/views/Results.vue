<template>
  <div ref="results">
    <!--<PrintButton />-->
    <h1>{{ $t("resultTitle") }}</h1>
    <Score />
    <p>
      <a href="http://www.tbs-sct.gc.ca/pol/doc-fra.aspx?id=32592#appC">{{
        $t("linkDirectiveText")
      }}</a>
    </p>
    <p></p>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-push-10 col-md-2">
          <strong>{{ $t("resultScore") }}:</strong>
          {{ score[2] }}
        </div>
      </div>
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
//import PrintButton from "@/plugins/PrintButton.vue";

@Component({
  components: {
    Result,
    Score
    //PrintButton
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
