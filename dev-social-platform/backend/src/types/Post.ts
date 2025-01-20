export interface Post {
  id: number;
  userid: number;
  title: string;
  content?: string;
  posttype: "normal" | "question";
  createdat: Date;
}
