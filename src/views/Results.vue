<template>
  <div>
    <h1>Algorithmic Impact Assessment Results</h1>
    <Score />
    <p>
      <div v-for="result in myResults"
          :key="result.name" >
        <Result :data=result></Result>
      </div>
    </p>
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
  }
})
export default class Results extends Vue {
  myResults = this.$store.getters.plainData;
}
</script>
