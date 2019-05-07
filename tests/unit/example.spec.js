import { shallowMount } from "@vue/test-utils";
import Home from "@/components/Modifier.vue";
describe("Home.vue", () => {
    it("renders props.msg when passed", () => {
        const data = "new message";
        const wrapper = shallowMount(Home, {
            propsData: { data },
            mocks: {
                $t: () => { }
            },
        });
        expect(wrapper.text()).toMatch(data);
    });
});
//# sourceMappingURL=example.spec.js.map