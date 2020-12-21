<template>
  <div>
    <div class="col-md-12">
      <br />
      <strong v-if="locale == undefined && numCounter == undefined">{{
        data.title
      }}</strong>
      <strong v-if="locale == undefined && numCounter != undefined">{{
        numCounter + ": " + data.title
      }}</strong>
      <strong v-if="locale !== undefined && numCounter != undefined">{{
        numCounter + ": " + data.titleData[locale]
      }}</strong>
      <strong v-if="locale !== undefined && numCounter == undefined">{{
        data.titleData[locale]
      }}</strong>
      <br />
      <div v-if="locale == undefined">
        {{ data.displayValue }}
        <span v-if="!data.name.endsWith('-NS')" style="float: right">
          <Modifier :data="data.value" :locale="locale" />
        </span>
      </div>
      <div v-if="locale !== undefined">
        <b-row>
          <b-col md="3">
            {{ data.selectedItem[locale] }}
          </b-col>
          <b-col v-if="!data.name.endsWith('-NS')" md="6">
            <Modifier :data="data.value" :locale="locale" />
          </b-col>
        </b-row>
      </div>
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
export default class ValueResult extends Vue {
  @Prop() data: any;
  @Prop() locale: any;
  @Prop() numCounter?: number;
}
</script>
