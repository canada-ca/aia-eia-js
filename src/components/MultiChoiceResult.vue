<template>
  <div>
    <div class="col-md-12">
      <strong v-if="locale == undefined">{{ num + ". " + data.title }}</strong>
      <strong v-if="locale !== undefined">{{
        num + ". " + data.titleData[locale]
      }}</strong>
      <br />
      <div v-for="(str, index) in data.value" :key="index">
        <div class="row">
          <div class="col-md-12 list-item valueResultPDF">
            {{ getItemLabel(str, index) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class MultiChoiceResult extends Vue {
  @Prop() data: any;
  @Prop() locale: any;
  @Prop() num!: number;
  getItemLabel(str: string, index: any): string {
    if (this.locale === undefined) {
      const matches = this.data.data.filter((item: any) => item.value === str);
      if (matches.length === 0) return "ERROR: No Matches found";
      return matches[0].displayValue;
    } else {
      var choiceValue = this.data.data[index].displayValue; // eslint-disable-line security/detect-object-injection
      var returnValue = "";
      var localePass = this.locale;
      this.data.choiceData.forEach(function(choice: any) {
        if (choice.en == choiceValue || choice.fr == choiceValue) {
          returnValue = choice[localePass]; // eslint-disable-line security/detect-object-injection
        }
      });
      return returnValue;
    }
  }
}
</script>
