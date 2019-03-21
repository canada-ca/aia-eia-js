<template>
  <div>
    <div v-if="data.value == data.displayValue">
      <TextResult :data=data />
    </div>
    <div v-else>
      <valueResult :data=data />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TextResult from "@/components/TextResult";
import ValueResult from "@/components/ValueResult";

@Component({
  components:{ 
    TextResult,
    ValueResult
  }
})
export default class Result extends Vue {
  @Prop() data : any;
}
</script>
