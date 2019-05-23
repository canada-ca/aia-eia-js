import { SurveyModel } from "survey-vue";

export interface RootState {
  plainData: any[];
  toolData: any;
  currentPageNo: number;
  result?: SurveyModel;
}
