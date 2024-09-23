"use client";

import { useState } from "react";

export function useResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // パスワードリセットメールの送信処理を実装
    try {
      // 実際のAPIコールをここに実装します
      // 以下はダミーのチェックです
      if (email === "test@example.com") {
        setSuccess(true);
      } else {
        throw new Error("メールの送信に失敗しました。");
      }
    } catch (err) {
      setError(
        "パスワードリセットメールの送信に失敗しました。もう一度お試しください。"
      );
    }
  };

  return {
    email,
    setEmail,
    error,
    success,
    handleSubmit,
  };
}
