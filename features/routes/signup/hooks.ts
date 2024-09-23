"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client/browserClient";

export function useSignup() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || password.length < 8) {
      setError(
        "入力内容に誤りがあります。すべての項目を正しく入力してください。"
      );
      return;
    }

    try {
      // Supabaseを使用したサインアップ処理
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // サインアップ成功後、/top にリダイレクト
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      // エラーハンドリング
      setError("サインアップに失敗しました。再度お試しください。");
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
