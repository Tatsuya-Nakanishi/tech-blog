export type UserType = {
  id: string; // UUIDとして文字列型に変更
  email: string;
  avatar_url: string | null; // フィールド名を修正
  nickname: string | null;
  created_at: string; // スネークケースに統一
  updated_at: string;
};
