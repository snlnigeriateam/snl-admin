export interface Property {
	prop: any;
	editable: boolean;
}

export interface Position {
  name: string,
  description: string,
  p_id: string,
  unique: boolean
}

export interface Training {
  t_id: string;
  annual: boolean;
  general: boolean;
  duration: number;
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

export interface TrainingActivity {
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
  progress: number,
  assigned_on: Date,//requires Date transformation
  assigned_by: string,
  deadline: Date,//requires Date transformation
  activity: Array<TrainingActivity>
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

export interface User {
  a_id: string,
  f_name: string,
  l_name: string,
  email: string,
  c_email: string,
  phone: string,
  active: boolean,
  revoked: boolean,
  suspension_deadline: Date | null,
  role: string,
  access_level: string,
  p_id: string,
  uri: string,
  tier: number
}

export interface MiniUser {
  a_id: string,
  f_name: string,
  l_name: string,
  email: string,
  c_email: string,
  phone: string,
  active: boolean,
  revoked: boolean,
  tier: number,
  access_level: string,
  p_id: string,
  uri: string
}

export interface AccessLevel {
  l_id: string,
  name: string,
  tier: number,
  permissions: Array<string>
}

export interface Event {
  e_id: string,
  name: string,
  start_date: Date,//requires date transformation
  end_date: Date,//requires date transformation
  type: string,
  description: string,
  group: string,
  invitees: Array<string>,
  tiers: Array<number>,
  year: number,
  created_by: string,
  created_on: Date,//requires date transformation
  trail: Array<EventActivity>
}

export interface EventActivity {
  on: Date,
  by: string,
  action: string,
  reason: string
}