<template>
  <div>
    <div v-if="data.value == data.displayValue">
      <TextResult :data=data />
    </div>
    <div v-else-if="Array.isArray(data.value)">
      <MultiChoiceResult :data=data />
    </div>
    <div v-else>
      <ValueResult :data=data />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TextResult from "@/components/TextResult.vue";
import ValueResult from "@/components/ValueResult.vue";
import MultiChoiceResult from "@/components/MultiChoiceResult.vue";

@Component({
  components:{ 
    TextResult,
    ValueResult, 
    MultiChoiceResult
  },
})
export default class Result extends Vue {
  @Prop() data : any;
}
</script>
