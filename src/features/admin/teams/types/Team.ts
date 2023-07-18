export default interface Team {
  id: string;
  fullTitleRu: string;
  fullTitleEn: string;
  country: string;
  logo?: string;
}

export type TeamId = Team['id'];
