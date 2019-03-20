import { SurveyModel } from "survey-vue";

export interface RootState {
  score: number;
  result?: SurveyModel;
}
