<template>
  <div>
    <div class="col-md-12">
      <strong v-if="locale == undefined">{{ data.title }}</strong>
      <strong v-if="locale !== undefined">{{ data.titleData[locale] }}</strong>
      <br />
      <ul>
        <div v-for="(str, index) in data.value" :key="index">
          <div class="row">
            <div class="col-md-10">
              <li>{{ getValue(str, index) }}</li>
            </div>
            <div class="col-md-2">
              <Modifier :data="getScore(str)" :locale="locale" />
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Modifier from "@/components/Modifier.vue";

@Component({
  components: {
    Modifier
  }
})
export default class MultiChoiceValueResult extends Vue {
  @Prop() data: any;
  @Prop() locale: any;
  getValueList() {
    return this.data.displayValue.split(", ");
  }
  // TODO this function is copy-paste from MultiChoiceResult.vue; duplicated...
  getValue(str: string, index: any): string {
    if (this.locale === undefined) {
      const matches = this.data.data.filter((item: any) => item.value === str);
      if (matches.length === 0) return "ERROR: No Matches found";
      return matches[0].displayValue;
    } else {
      return this.data.choiceData[index][this.locale];
    }
  }
  // TODO this is very similar to stuff in store.ts, but I don't know how to access it here
  getScore(val: String): number {
    if (typeof val === "number") {
      return val;
    }
    if (typeof val === "string") {
      // if string is a number, must be a score, e.g. "3"
      var value = Number(val);
      if (!isNaN(value)) {
        return value;
      }

      // see if it's the format item2-4, where 4 is the score
      var lastHyphenIdx = val.lastIndexOf("-");
      if (lastHyphenIdx !== -1) {
        // Suffix after last "-" could be a number.
        var possibleValue = val.substr(lastHyphenIdx + 1);
        value = Number(possibleValue);
        if (!isNaN(value)) {
          return value;
        }
      }
    }
    return 0;
  }
}
</script>
