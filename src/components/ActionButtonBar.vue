<template>
  <div>
    <div v-if="$store.getters.inProgress">
      <div class="row no-gutters" style="padding: 0 15px">
        <div
          class="col-3 col-sm-2 col-md-3 "
          style="max-width: 120px; margin: 0 2px;"
        >
          <button
            type="button"
            class="btn survey-button"
            style="width: inherit"
            v-on:click="saveSurvey"
          >
            {{ $t("saveButton") }}
          </button>
        </div>
        <div
          class="col-3 col-sm-3 col-md-3 "
          style="max-width: 140px; margin: 0 2px;"
        >
          <button
            type="button"
            value="Start Over"
            class="btn survey-button"
            style="width: inherit"
            v-on:click="$emit('startAgain')"
          >
            {{ $t("startAgain") }}
          </button>
        </div>
        <div class="col-md-3 col-sm-12">
          <input
            type="file"
            class="btn btn-default"
            :title="$t('loadFile')"
            value="Load"
            @change="onFileChanged($event)"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <input
        type="file"
        class="btn btn-default"
        value="Load"
        :title="$t('loadFile')"
        @change="onFileChanged($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import showdown from "showdown";
import i18n from "@/plugins/i18n";
import SurveyFile from "@/interfaces/SurveyFile";

@Component
export default class ActionButtonBar extends Vue {
  saveSurvey() {
    const a = document.createElement("a");
    a.download = "SurveyResults.json";

    const saveFile = this.buildSurveyFile();
    const blob = new Blob([saveFile], { type: "text/plain" });

    a.href = window.URL.createObjectURL(blob);

    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");

    const e = document.createEvent("MouseEvents");
    e.initEvent("click", true, false);
    a.dispatchEvent(e);
  }

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
  buildSurveyFile(): string {
    return JSON.stringify({
      currentPage: this.$store.state.currentPageNo,
      data: this.$store.state.toolData
    });
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
