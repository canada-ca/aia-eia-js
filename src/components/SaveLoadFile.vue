<template>
  <div>
    <button
      type="button"
      class="mrgn-bttm-sm btn btn-success"
      v-on:click="saveSurvey"
    >
      {{ $t("saveButton") }}
    </button>
    <input
      type="file"
      class="btn btn-default"
      value="Load"
      @change="onFileChanged($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import showdown from "showdown";
import i18n from "@/plugins/i18n";
import SurveyFile from "@/interfaces/SurveyFile";

@Component
export default class SaveLoadFile extends Vue {
  // saveSurvey() {

  //   const a = document.createElement('a');
  //   a.download = "SurveyResults.json";

  //   const saveFile = this.$store.getters.SurveyFile;
  //   const blob = new Blob([saveFile], {type: 'text/plain'})

  //   a.href = window.URL.createObjectURL(blob);

  //   a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');

  //   const e = document.createEvent('MouseEvents');
  //   e.initEvent('click', true, false);
  //   a.dispatchEvent(e);
  // }

  onFileChanged($event: any) {
    if (
      $event === null ||
      $event.target === null ||
      $event.dataTransfer === null
    ) {
      return;
    }

    const target = $event.target as HTMLInputElement;
    const files = target.files || $event.dataTransfer.files;

    if (files.length === 0) {
      return;
    }

    this.loadSurvey(files[0]);
  }

  loadSurvey(file: any) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent) => {
      const result = reader.result as string;
      if (result === "undefined") {
        return;
      }

      const loadedFile: SurveyFile = JSON.parse(result);
      this.$emit("fileLoaded", loadedFile);
    };

    reader.readAsText(file);
  }
}
</script>
