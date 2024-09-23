"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client/browserClient";
import { useRouter } from "next/navigation";

export function useLogin() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("メールアドレスとパスワードを正しく入力してください。");
      return;
    }

    try {
      // Supabaseを使用したログイン処理
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      // ログイン成功後、/top にリダイレクト
      router.push("/top");
      router.refresh();
    } catch (err) {
      // エラーハンドリング
      setError("ログインに失敗しました。再度お試しください。");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  };
}
