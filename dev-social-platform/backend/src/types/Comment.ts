export interface Comment {
  id: number;
  userid: number;
  postid: number;
  content: string;
  createdat: Date;
  username?: string;
  profilepicture?: string;
  likecount?: number;
  islikedbyuser?: boolean;
}
