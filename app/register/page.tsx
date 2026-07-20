"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nickname }),
    });
    const data = await res.json();
    setMessage(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>ユーザー登録</h2>
      <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="ニックネーム" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <button type="submit">登録</button>
      <p>{message}</p>
    </form>
  );
}
