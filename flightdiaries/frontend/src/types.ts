export interface DiaryEntry {
  id: string;
  weather: string;
  visibility: string;
  date: string;
  comment?: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, "id">;
