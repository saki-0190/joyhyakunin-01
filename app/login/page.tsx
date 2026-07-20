"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      // ログイン成功時にユーザー情報を保存
      localStorage.setItem("user", JSON.stringify(data));
      // マイページへ遷移
      router.push("/mypage");
    } else {
      const err = await res.json();
      setError(err.detail || "ログインに失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>ログイン</h2>
      <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">ログイン</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
