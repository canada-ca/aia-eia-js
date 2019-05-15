import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

function localVueInstance() {
  const localVue = createLocalVue();

  localVue.use(Vuex);

  return localVue;
}

describe("store.ts", () => {
  it("renders calcscore getter", () => {
    let getters;
    let store;

    beforeEach(() => {
      getters = {
        score: () => 18
      };

      store = new Vuex.Store({
        getters
      });
    });

    // expect(addItemsInArray([5])).toBe(5);
  });
});
