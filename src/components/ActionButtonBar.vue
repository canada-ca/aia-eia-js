<template>
  <div class="page-actions">
    <div v-if="$store.getters.inProgress">
      <b-row class="no-gutters" align-h="center" style="padding: 0 15px">
        <b-col
          class="col-lg-2 col-sm-5 col-md-10 col-xs-6"
          style="margin: 0 165px 0 2px;"
        >
          <input
            type="file"
            class="btn btn-default"
            :title="$t('loadFile')"
            value="Load"
            style="padding: 0"
            @change="onFileChanged($event)"
          />
        </b-col>
        <b-col
          class="col-lg-2 col-sm-5 col-md-3 col-xs-6"
          style="margin: 2px 2px;"
        >
          <button
            type="button"
            class="btn survey-button"
            style="width: inherit"
            v-on:click="saveSurvey"
          >
            {{ $t("saveButton") }}
          </button>
        </b-col>
        <b-col
          class="col-lg-2 col-sm-5 col-md-3 col-xs-6"
          style="margin: 2px 2px;"
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
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <b-row align-h="center">
        <b-col class="col-sm-3" style="margin: 2px 2px;">
          <input
            type="file"
            class="btn btn-default"
            value="Load"
            :title="$t('loadFile')"
            @change="onFileChanged($event)"
          />
        </b-col>
        <b-col class="col-sm-2 col-xs-6" style="margin: 2px 2px;"></b-col>
        <b-col class="col-sm-2 col-xs-6" style="margin: 2px 2px;"></b-col>
      </b-row>
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
