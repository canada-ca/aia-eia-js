import store from "@/store";
import { SurveyModel } from "survey-vue";
import surveyJSON from "@/survey-enfr.json";

describe("store.ts", () => {
  it("calcScore getter is properly calculated if data is defined", () => {
    store.state.result = new SurveyModel(surveyJSON);

    const result = new SurveyModel(surveyJSON);

    result.data = {
      projectDetailsRespondent: "name",
      projectDetailsJob: "position",
      "projectDetailsDepartment-NS": "item061",
      projectDetailsBranch: "test",
      projectDetailsTitle: "project",
      projectDetailsPhase: "item1",
      projectDetailsDescription: "desc",
      decisionSector1: ["item1-1", "item2-1", "item3-1"]
    };

    store.commit("updateResult", result);

    const calcScore = store.getters.calcScore;

    expect(calcScore).toEqual([3, 0, 3, 1]);
  });

  it("calcScore is properly calculated if data is undefined", () => {
    store.state.result = undefined;
    const getter = store.getters.calcScore;

    expect(getter).toEqual([0, 0, 0]);
  });

  it("tooldata getter calculated properly, if state is defined", () => {
    store.state.result = new SurveyModel(surveyJSON);

    const result = new SurveyModel(surveyJSON);

    result.data = {
      projectDetailsRespondent: "name",
      projectDetailsJob: "position",
      "projectDetailsDepartment-NS": "item061",
      projectDetailsBranch: "test",
      projectDetailsTitle: "project",
      projectDetailsPhase: "item1",
      projectDetailsDescription: "desc",
      decisionSector1: ["item1-1", "item2-1", "item3-1"]
    };

    store.commit("updateResult", result);

    const toolDataGetter = store.state.toolData;

    expect(toolDataGetter).toEqual(result.data);
  });

  it("there are valid number of results in resultDataSections getter sections", () => {
    store.state.result = new SurveyModel(surveyJSON);

    const result = new SurveyModel(surveyJSON);

    result.data = {
      projectDetailsRespondent: "name",
      projectDetailsJob: "position",
      "projectDetailsDepartment-NS": "item061",
      projectDetailsBranch: "test",
      projectDetailsTitle: "project",
      projectDetailsPhase: "item1",
      projectDetailsDescription: "desc",
      decisionSector1: ["item1-1", "item2-1", "item3-1"],
      impact5: "item1-4",
      dataQualityDesign7: "item1-2"
    };

    store.commit("updateResult", result);

    const resultDataSections = store.getters.resultDataSections;

    expect(resultDataSections[0].length).toEqual(7);
    expect(resultDataSections[1].length).toEqual(2);
    expect(resultDataSections[2].length).toEqual(1);
  });
});
