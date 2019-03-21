<template>
  <div>
    <h1>Algorithmic Impact Assessment Results</h1>
    <Score />
    <p></p>
    <div class="container-fluid">
      <div class="row" v-for="result in myResults" :key="result.name">
        <Result :data="result"></Result>
      </div>
      <div class="row">
        <div class="col-md-push-10 col-md-2">
          <strong>Final Score:</strong> {{ score }}
        </div>
      </div>
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
  myResults = this.$store.getters.plainData;
}
</script>
