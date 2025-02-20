export interface Training {
  t_id: string;
  annual: boolean;
  recurring: boolean;
  even_years: boolean;
  internal: boolean;
  title: string;
  active: boolean;
  tiers: Array<number>;
  deadline: Date;
  deadline_warning: number;
  link: string;
  content: Array<TrainingContent>;
  tests: Array<any>;
  created_by: string;
  created_on: Date;
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

export interface TrainingAsset{
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