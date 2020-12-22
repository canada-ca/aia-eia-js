<template>
  <div>
    <div class="col-md-12">
      <br />
      <strong v-if="locale == undefined && numCounter != undefined">{{
        numCounter + ": " + data.title
      }}</strong>

      <strong v-if="locale == undefined && numCounter == undefined">{{
        data.title
      }}</strong>

      <strong v-if="locale !== undefined && numCounter != undefined">{{
        numCounter + ": " + data.titleData[locale]
      }}</strong>

      <strong v-if="locale !== undefined && numCounter == undefined">{{
        data.titleData[locale]
      }}</strong>


      <br />
      <div v-for="(str, index) in data.value" :key="index">
        <div class="row">
          <div class="col-md-10 list-item valueResultPDF">
            {{ getItemLabel(str, index) }}
          </div>
          <div class="col-md-2">
            <span style="float: right">
              <Modifier :data="getScore(str)" :locale="locale" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Modifier from "@/components/Modifier.vue";
import { getValue } from "@/store.ts";
import MultiChoiceResult from "@/components/MultiChoiceResult.vue";

@Component({
  components: {
    Modifier
  }
})
export default class MultiChoiceValueResult extends MultiChoiceResult {
  getScore(val: String): number {
    return getValue(val);
  }
}
</script>
