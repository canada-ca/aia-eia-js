import store from "@/store";
import { SurveyModel } from "survey-vue";
import surveyJSON from "@/survey-enfr.json";

describe("store.ts", () => {
  it("calcscore getter is properly calculated if data is defined", () => {
    store.state.result = new SurveyModel(surveyJSON);

    const result = new SurveyModel(surveyJSON);

    result.data = {
      respondent: "name",
      title: "position",
      "department-NS": "item061",
      branch: "test",
      "project-title": "project",
      description: "desc",
      "sector-categories": ["item1-1", "item2-1", "item3-1"]
    };

    store.commit("updateResult", result);

    const calcscore = store.getters.calcscore;

    expect(calcscore).toEqual([3, 0, 3, 1]);
  });

  it("calcscore is properly calculated if data is undefined", () => {
    store.state.result = undefined;
    const getter = store.getters.calcscore;

    expect(getter).toEqual([0, 0, 0]);
  });

  it("tooldata getter calculated properly, if data is not defined", () => {
    store.state.result = undefined;

    const toolDataGetter = store.getters.toolData;

    expect(toolDataGetter).toEqual({});
  });

  it("tooldata getter calculated properly, if state is defined", () => {
    store.state.result = new SurveyModel(surveyJSON);

    const result = new SurveyModel(surveyJSON);

    result.data = {
      respondent: "name",
      title: "position",
      "department-NS": "item061",
      branch: "test",
      "project-title": "project",
      description: "desc",
      "sector-categories": ["item1-1", "item2-1", "item3-1"]
    };

    store.commit("updateResult", result);

    const toolDataGetter = store.getters.toolData;

    expect(toolDataGetter).toEqual(result.data);
  });

  it("there are valid number of results in resultDataSections getter sections", () => {
    store.state.result = new SurveyModel(surveyJSON);

    const result = new SurveyModel(surveyJSON);

    result.data = {
      respondent: "name",
      title: "position",
      "department-NS": "item061",
      branch: "test",
      "project-title": "project",
      description: "desc",
      "sector-categories": ["item1-1", "item2-1", "item3-1"],
      question8: "4",
      question37: "2"
    };

    store.commit("updateResult", result);

    const resultDataSections = store.getters.resultDataSections;

    expect(resultDataSections[0].length).toEqual(6);
    expect(resultDataSections[1].length).toEqual(2);
    expect(resultDataSections[2].length).toEqual(1);
  });
});
