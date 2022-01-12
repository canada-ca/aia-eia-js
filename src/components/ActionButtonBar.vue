<template>
  <div>
    <div v-if="$store.getters.inProgress">
      <ul class="list-inline lst-spaced">
        <li>
          <button
            type="button"
            class="mrgn-bttm-sm btn btn-success"
            v-on:click="saveSurvey"
          >
            {{ $t("saveButton") }}
          </button>
        </li>
        <li>
          <label for="fileChoose" class="btn btn-default">
            {{ $t("jsonFileUpload") }}
          </label>
          <input
            id="fileChoose"
            type="file"
            value="Load"
            accept=".json"
            style="display: none"
            @change="onFileChanged($event)"
          />
        </li>
        <li>
          <button
            type="button"
            value="Start Over"
            class="btn btn-default"
            v-on:click="startModal"
          >
            {{ $t("startAgain") }}
          </button>
        </li>
      </ul>
    </div>
    <div v-else>
      <label for="fileChoose" class="btn btn-default">
        {{ $t("jsonFileUpload") }}
      </label>
      <input
        id="fileChoose"
        type="file"
        value="Load"
        accept=".json"
        style="display: none"
        @change="onFileChanged($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import showdown from "showdown";
import i18n from "@/plugins/i18n";
import SurveyFile from "@/interfaces/SurveyFile";
import { Model } from "survey-vue";

@Component
export default class ActionButtonBar extends Vue {
  @Prop() survey?: Model;
  startModal() {
    let text =
      this.$i18n.locale === "fr"
        ? "Cette action effacera toutes les données non enregistrées. Êtes-vous sûr de vouloir continuer ?"
        : "This will erase all unsaved data. Are you sure you want to continue?";
    if (confirm(text)) {
      this.$emit("startAgain");
    }
  }
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
      version: this.$store.state.version,
      currentPage: this.$store.state.currentPageNo,
      data: this.$store.state.toolData,
      translationsOnResult: this.$store.state.translationsOnResult
    });
  }
  loadSurvey(file: any) {
    var extension = "";
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent) => {
      const result = reader.result as string;
      if (result === "undefined") {
        return;
      }

      const loadedFile: SurveyFile = JSON.parse(result);
      this.$emit("fileLoaded", loadedFile);
    };

    extension = file.name.split(".").pop();

    //Error check to inform users they need to submit a JSON file otherwise it will ask them to submit the correct file type
    if (!extension || extension.toLowerCase() != "json") {
      alert(this.$t("alertNotificationWrongPopUp"));
    }

    reader.readAsText(file);
  }
}
</script>
