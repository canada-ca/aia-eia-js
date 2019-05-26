
import en from "@/plugins/en.json";
import fr from "@/plugins/fr.json";
import _ from "lodash";

const enKeys = Object.keys(en);
const frKeys = Object.keys(fr);

describe("i18n", () => {
  it("should have identical keys", () => {
    const val = _.difference(enKeys, frKeys);
    const enIntersection = _.intersection(enKeys, val);
    const mek = enIntersection.join("\n")
    const frIntersection = _.intersection(frKeys, val);
    const mfk  = frIntersection.join("\n");
    
    console.log(`
extra keys in en.json
${mek}
extra keys in fr.json
${mfk}`);
    
    expect(Object.keys(val).length).toBe(0);
  });
  

});
