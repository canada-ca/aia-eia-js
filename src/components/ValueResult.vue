<template>
  <b-row>
    <div v-if="locale == undefined">
      <br />
      <strong>{{ data.title }}</strong>
      <br />
      {{ data.displayValue }}
      <span v-if="!data.name.endsWith('-NS')" style="float: right">
        <Modifier :data="data.value" :locale="locale" />
      </span>
      <br />
    </div>

    <b-col v-if="locale !== undefined" md="12">
      <strong>{{ data.titleData[locale] }}</strong>
      <b-row>
        <b-col md="4">
          {{ data.selectedItem[locale] }}
        </b-col>

        <b-col v-if="!data.name.endsWith('-NS')" md="8">
          <Modifier :data="data.value" :locale="locale" />
          <br />
        </b-col>
      </b-row>
    </b-col>
  </b-row>
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
