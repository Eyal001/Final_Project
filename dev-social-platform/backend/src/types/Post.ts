export interface Post {
  id: number;
  userid: number;
  title: string;
  content?: string;
  posttype: "normal" | "question";
  createdat: Date;
  username?: string;
  profilepicture?: string;
  likecount?: number;
  islikedbyuser?: boolean;
}
