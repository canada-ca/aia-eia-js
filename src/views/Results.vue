<template>
  <div>
    <h1>Algorithmic Impact Assessment Results</h1>
    <Score />
    <p></p>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-push-10 col-md-2">
          <strong>Final Score:</strong> {{ score[2] }}
        </div>
      </div>
      <ul class="list-unstyled">
        <li>
          <details>
            <summary>Mitigation Mesures</summary>
            <div class="row" v-for="result in myResults[3]" :key="result.name">
              <Result :data="result"></Result>
            </div>            
          </details>
        </li>
        <li>
          <details>
            <summary>Questions and answers</summary>
            <ul class="list-unstyled">
              <li>
                <details>
                  <summary>Project Details</summary>
                    <div class="row" v-for="result in myResults[0]" :key="result.name">
                      <Result :data="result"></Result>
                    </div>
                </details>
              </li>
              <li>
                <details>
                  <summary>Risk Questions and Answers</summary>
                    <div class="row" v-for="result in myResults[1]" :key="result.name">
                      <Result :data="result"></Result>
                    </div>
                </details>
              </li>
              <li>
                <details>
                  <summary>Mitigation  Questions and Answers</summary>
                    <div class="row" v-for="result in myResults[2]" :key="result.name">
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

@Component({
  components: {
    Result,
    Score
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
