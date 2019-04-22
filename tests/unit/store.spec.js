import store from "@/store";
describe("store.ts", () => {
    it("renders calcscore getter", () => {
        const state = {
            result: undefined
        };
        const getter = store.getters.calcscore;
        console.log(getter);
        expect(getter.toBe([0, 0, 0]));
    });
});
//# sourceMappingURL=store.spec.js.map