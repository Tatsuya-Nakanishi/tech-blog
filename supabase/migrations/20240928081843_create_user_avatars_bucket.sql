-- user_avatars ストレージバケットを作成
INSERT INTO storage.buckets (id, name, public) VALUES ('user_avatars', 'user_avatars', true);

-- プロフィール画像は誰でも参照可能にするポリシー
CREATE POLICY "プロフィール画像は誰でも参照可能"
ON storage.objects
FOR SELECT
USING (bucket_id = 'user_avatars');

-- プロフィール画像はログインユーザーが追加できるポリシー
CREATE POLICY "プロフィール画像はログインユーザーが追加"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'user_avatars' AND auth.role() = 'authenticated');

-- 自身のプロフィール画像を更新できるポリシー
CREATE POLICY "自身のプロフィール画像を更新"
ON storage.objects
FOR UPDATE
WITH CHECK (bucket_id = 'user_avatars' AND auth.uid() = owner);

-- 自身のプロフィール画像を削除できるポリシー
CREATE POLICY "自身のプロフィール画像を削除"
ON storage.objects
FOR DELETE
USING (bucket_id = 'user_avatars' AND auth.uid() = owner);
