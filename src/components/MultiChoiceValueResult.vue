<template>
  <div>
    <b-row>
      <br />
      <div v-if="locale == undefined">
        <strong>{{ data.title }}</strong>

        <div v-for="(str, index) in data.value" :key="index">
          <div class="row">
            <div class="col-md-10 list-item">
              {{ getItemLabel(str, index) }}
            </div>
            <span style="float: right">
              <Modifier :data="getScore(str)" :locale="locale" />
            </span>
          </div>
        </div>
      </div>

      <div v-else-if="locale !== undefined">
        <strong>{{ data.titleData[locale] }}</strong>
        <div v-for="(str, index) in data.value" :key="index">
          <div class="row">
            <div class="col-md-10 list-item">
              {{ getItemLabel(str, index) }}
            </div>
            <span>
              <Modifier
                :data="getScore(str)"
                :locale="locale"
                style="padding-left: 10px"
              />
            </span>
          </div>
        </div>
      </div>
      <br/>
    </b-row>
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
