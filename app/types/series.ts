export interface Series {
  id: string;
  title: string;
  description: string;
  postCount?: number;
  posts?: {
    id: string;
    title: string;
    authorName: string;
  }[];
}