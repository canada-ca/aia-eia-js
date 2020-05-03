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
              <li>{{ getItemLabel(str, index) }}</li>
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
