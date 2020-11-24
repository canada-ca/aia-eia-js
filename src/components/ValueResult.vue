<template>
  <div>
    <div class="col-md-10">
      <strong v-if="locale == undefined">{{ data.title }}</strong>
      <strong v-if="locale !== undefined">{{ data.titleData[locale] }}</strong>
      <br />
      <div v-if="locale == undefined">{{ data.displayValue }}</div>
      <div v-if="locale !== undefined">{{ data.selectedItem[locale] }}</div>
    </div>
    <div v-if="!data.name.endsWith('-NS')" class="col-md-2">
      <Modifier :data="data.value" :locale="locale" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Modifier from "@/components/Modifier.vue";

@Component({
  components: {
    Modifier,
  },
})
export default class ValueResult extends Vue {
  @Prop() data: any;
  @Prop() locale: any;
}
</script>
