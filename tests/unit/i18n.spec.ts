import en from "@/plugins/en.json";
import fr from "@/plugins/fr.json";
import _ from "lodash";

const enKeys = Object.keys(en);
const frKeys = Object.keys(fr);

describe("i18n", () => {
  it("should have identical keys", () => {
    const val = _.difference(enKeys, frKeys);
    if (val.length > 0) {

      const mek = _.intersection(enKeys, val)
                   .join("\n");

      const mfk = _.intersection(frKeys, val)
                   .join("\n");

      console.log(
        `extra keys in en.json\n ${mek} extra keys in fr.json\n ${mfk}`
      );
    }

    expect(Object.keys(val).length).toBe(0);
  });
});
