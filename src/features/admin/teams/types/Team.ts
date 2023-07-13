export default interface Team {
  id: string;
  fullTitleRu: string;
  shortTitleRu: string;
  fullTitleEn: string;
  shortTitleEn: string;
}

export type TeamId = Team['id'];
