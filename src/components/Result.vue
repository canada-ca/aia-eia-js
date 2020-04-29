<template>
  <div>
    <div v-if="data.questionHeader !== undefined && locale !== undefined">
      <h3>{{ data.questionHeader[locale] }}</h3>
    </div>
    <div>
      <div v-if="data.value == data.displayValue">
        <TextResult :data="data" :locale="locale" />
      </div>
      <div v-else-if="isMultiChoiceValueResult(data)">
        <MultiChoiceValueResult :data="data" :locale="locale" />
      </div>
      <div v-else-if="Array.isArray(data.value)">
        <MultiChoiceResult :data="data" :locale="locale" />
      </div>
      <div v-else>
        <ValueResult :data="data" :locale="locale" />
      </div>
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
  @Prop() locale: any;
  isMultiChoiceValueResult(data: any): boolean {
    if (!Array.isArray(data.value)) return false;

    //return true if one of the value has a score
    return data.value.reduce((accumulator: boolean, currentValue: any) => {
      return this.hasScore(currentValue) || accumulator;
    }, false);
  }

  // TODO this is duplicating code from store.ts; can we access it here?
  hasScore(val: String): boolean {
    if (typeof val !== "string") {
      return false;
    }
    var lastHyphenIdx = val.lastIndexOf("-");
    if (lastHyphenIdx !== -1) {
      // Suffix after last "-" could be a number.
      var possibleValue = val.substr(lastHyphenIdx + 1);
      var value = Number(possibleValue);
      return !isNaN(value);
    }
    return false;
  }
}
</script>
