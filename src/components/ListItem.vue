<!-- on the results page, used to output the requirements with multiple elements as list items.
     For example, for the peer review, they can consult a federal expert, a corporation, a university, etc.

     To do this, the text attribute uses \n characters as markers. If none are present, the text
     is outputted as-is. The list elements are reach separated by \n, and the list starts after \n\n.

     Using the example above, the input could be 
     "Consulting the appropriate experts, which can include:\n\nA federal expert\nA corporation\nA university"

     which would be outputted as
          Consulting the appropriate experts, which can include:
          * A federal expert
          * A corporation
          * A university
-->

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
