import { test, expect } from '@playwright/test';
import { createClient } from "@/lib/supabase/client/testClient";

const testEmail = 'test@example.com';
const testPassword = 'testpassword123';

test.beforeAll(async () => {
  const supabase = createClient();

  // 新しいテストユーザーを作成
  const { error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      // supabaseの仕様でテストユーザーが既に存在していたらエラーが返ってくるため正常
      console.error('テストユーザーが既に存在しています。');
      return;
    }
    console.error('テストユーザーの作成に失敗しました:', error.message);
  } else {
    console.log('新しいテストユーザーを作成しました');
  }
});

test.describe('ログインテスト', () => {

  test('正常なログイン', async ({ page }) => {
    await page.goto('/login');

    // フォームに入力
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // リダイレクト先を確認
    await expect(page).toHaveURL('/top');

    // ヘッダーの表示を確認
    await expect(page.getByText("マイページ")).toBeInViewport();
    await expect(page.getByText("ログアウト")).toBeInViewport();
  });

  test('無効なログイン', async ({ page }) => {
    await page.goto('/login');

    // 無効な認証情報を入力
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // エラーメッセージを確認
    await expect(page.locator('text=ログインに失敗しました。再度お試しください。')).toBeVisible();
  });

  test('入力バリデーション', async ({ page }) => {
    await page.goto('/login');

    // 空のフォームを送信
    await page.click('button[type="submit"]');

    // バリデーションエラーメッセージを確認
    await expect(page.locator('text=メールアドレスとパスワードを正しく入力してください。')).toBeVisible();
  });
});