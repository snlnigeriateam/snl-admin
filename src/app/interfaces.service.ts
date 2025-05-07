export interface Training {
  t_id: string;
  annual: boolean;
  recurring: boolean;
  even_years: boolean;
  internal: boolean;
  title: string;
  active: boolean;
  tiers: Array<number>;
  deadline: Date;//requires date transformation
  deadline_warning: number;
  link: string;
  content: Array<TrainingContent>;
  test_question_count: number;
  pass_percentage: number;
  test_duration: number;
  created_by: string;
  created_on: Date;//requires date transformation
  years_active: Array<number>;
  trail: Array<TrailItem>;
}

export interface TrailItem {
  on: Date;
  by: string;
  action: string
}

export interface Role {
  name: string,
  tier: number
}

export interface TrainingAsset {
  a_id: string,
  type: number,
  t_id: string,
  label: string,
  uri: string,
  uri_name: string
}

export interface TrainingContent {
  c_id: string,
  heading: string,
  content: string,
  assets: Array<TrainingAsset>
}

export interface TestQuestion {
  t_id: string,
  q_id: string,
  question: string,
  options: Array<QuestionOption>,//requires transformation before usage (typically done server-side). Default behaviour is to come in as an array of strings
  answer_index: number
}

export interface QuestionOption {
  text: string,
  index: number
}

export interface TrainingProgress {
  on: Date,
  action: string,
  id: string
}

export interface UserTrainingProgress {
  year: number,
  current: string,
  started: boolean,
  started_on?: Date,//requires Date transformation
  completed_on: Date,
  score: number,
  t_id: string,
  progress: Array<TrainingProgress>
}

export interface UserTraining extends Training {
  progress: UserTrainingProgress,
}

export interface UserTestQuestion {
  q_id: string,
  question: string,
  options: Array<string>,
  answer_index: number,
  selected_index?: number
}

export interface Department {
  d_id: string,
  name: string,
  head: string,
}