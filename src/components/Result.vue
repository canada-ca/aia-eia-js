<template>
  <div>
    <div v-if="data.value == data.displayValue">
      <TextResult :data="data" />
    </div>
    <div v-else-if="isMultiChoiceValueResult(data)">
      <MultiChoiceValueResult :data="data" />
    </div>
    <div v-else-if="Array.isArray(data.value)">
      <MultiChoiceResult :data="data" />
    </div>
    <div v-else>
      <ValueResult :data="data" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TextResult from "@/components/TextResult.vue";
import ValueResult from "@/components/ValueResult.vue";
import MultiChoiceResult from "@/components/MultiChoiceResult.vue";
import MultiChoiceValueResult from "@/components/MultiChoiceValueResult.vue";

@Component({
  components: {
    TextResult,
    ValueResult,
    MultiChoiceResult,
    MultiChoiceValueResult
  }
})
export default class Result extends Vue {
  @Prop() data: any;
  isMultiChoiceValueResult(data: any): boolean {
    if (!Array.isArray(data.value)) return false;

    //return true if all items are numbers
    return data.value.reduce((acc: boolean, currval: any) => {
      return typeof currval === "number" && acc;
    }, true);
  }
}
</script>
