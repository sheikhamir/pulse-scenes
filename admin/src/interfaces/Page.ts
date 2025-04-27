export interface Page {
  id: number;
  title: string;
  slug: string;
  icon: string;
  active?: string;
}

export interface Config {
  key: string;
  value: string;
}
