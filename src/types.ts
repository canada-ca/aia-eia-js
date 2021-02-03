import { IPanel, Question, SurveyModel } from "survey-vue";

export interface SurveyScoring {
  surveySections: Section[];
}

export interface RootState {
  sections: Section[];
  sectionsNames: string[];
  sectionsAllEnabled: boolean;
  sectionsEnabled: string[];
  answerData: any[];
  scoring?: SurveyScoring;
  surveyModel?: SurveyModel;
  toolData: any;
  currentPageNo: number;
}

export interface Section {
  sectionName: string;
  enabled: boolean;
  questionsNames: string[];
  userScore: number;
  questions: Question[];
}

export interface ResultsData {
  scoring: SurveyScoring;
  sectionsEnabled: any;
  data: any;
}
