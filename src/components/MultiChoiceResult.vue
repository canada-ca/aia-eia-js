<template>
  <div>
    <div class="col-md-12">
      <strong v-if="locale == undefined">{{ data.title }}</strong>
      <strong v-if="locale !== undefined">{{ data.titleData[locale] }}</strong>
      <br />
      <ul v-for="(str, index) in data.value" :key="index">
        <li>{{ getItemLabel(str, index) }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class MultiChoiceResult extends Vue {
  @Prop() data: any;
  @Prop() locale: any;
  getItemLabel(str: string, index: any): string {
    if (this.locale === undefined) {
      const matches = this.data.data.filter((item: any) => item.value === str);
      if (matches.length === 0) return "ERROR: No Matches found";
      return matches[0].displayValue;
    } else {
      return this.data.choiceData[index][this.locale];
    }
  }
}
</script>
