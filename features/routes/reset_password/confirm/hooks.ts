"use client";

import { useState } from "react";

export function usePasswordResetConfirm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    if (newPassword.length < 8) {
      setError("パスワードは8文字以上で設定してください。");
      return;
    }

    try {
      // ここで実際のパスワードリセット処理を実装します
      // この例ではダミーの成功レスポンスを返します
      await new Promise((resolve) => setTimeout(resolve, 1000)); // APIコールをシミュレート
      setSuccess(true);
    } catch (err) {
      setError("パスワードのリセットに失敗しました。もう一度お試しください。");
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    handleSubmit,
  };
}
