"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("owner@indianfoodridgewood.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError("Login failed");
      return;
    }
    router.push("/admin/orders");
  }
  return (
    <form onSubmit={onSubmit} className="mx-auto mt-24 max-w-sm space-y-4 px-4">
      <h1 className="display text-3xl">Kitchen</h1>
      <label className="block">
        Email
        <input
          className="mt-1 min-h-11 w-full rounded-lg bg-black/40 px-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
      </label>
      <label className="block">
        Password
        <input
          type="password"
          className="mt-1 min-h-11 w-full rounded-lg bg-black/40 px-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error && <p className="text-[var(--danger)]">{error}</p>}
      <button className="min-h-11 w-full rounded-full bg-[var(--saffron)] font-semibold text-[var(--ink)]">Log in</button>
    </form>
  );
}
