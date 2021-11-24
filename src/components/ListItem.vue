<template>
  <div>
    <p>{{ title }}</p>
    <div v-if="list.length > 1">
      <ul v-for="(item, index) in list" :key="index">
        <li>{{ item }}</li>
      </ul>
    </div>
    <p v-if="list.length === 1">{{ list[0] }}</p>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ListItem extends Vue {
  @Prop() text!: string;
  private title: string = "";
  private list: string[] = [];
  mounted() {
    if (this.text.indexOf("\n") < 0) {
      this.title = this.text;
    } else {
      this.title = this.text.split("\n\n")[0];
      this.list = this.text.split("\n\n")[1].split("\n");
    }
  }
}
</script>
