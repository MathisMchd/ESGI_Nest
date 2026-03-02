import { MangaStatus } from "./manga-status";

export interface Manga {
  id: number;
  title: string;
  author: string;
  genres: string[];
  status: string;
  volumes: number;
  startYear: number;
  publisher: string;
  synopsis: string;
}