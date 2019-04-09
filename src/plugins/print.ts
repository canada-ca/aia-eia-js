import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import i18n from "@/plugins/i18n";

export default {
  name: "test AIA print",
  props: {
    msg: String
  },
  methods: {
    downloadWithCSS() {
      const doc = new jsPDF();
      /** WITH CSS */
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function(
        canvas
      ) {
        const img = canvas.toDataURL("image/png");
        doc.addImage(img, "JPEG", 20, 20);
        doc.save("sample.pdf");
      });
    }
  }
};
