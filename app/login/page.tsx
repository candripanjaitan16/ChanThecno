"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Testing sementara.
    // Password tidak disimpan.
    localStorage.setItem("isLoggedIn", "true");

    // Setelah login langsung ke dashboard.
    router.replace("/akun/dashboard");
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-black px-6 text-white">
      <main className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium text-blue-500">ChanThecno</p>

          <h1 className="text-3xl font-bold">Welcome back</h1>

          <p className="mt-2 text-sm text-zinc-400">
            Login untuk masuk ke dashboard ChanThecno.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Email</label>

            <input
              type="email"
              name="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
              className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>

              <a
                href="/forgot-password"
                className="text-xs text-blue-500 transition hover:text-blue-400"
              >
                Lupa password?
              </a>
            </div>

            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
              className="rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Login */}
          <button
            type="submit"
            className="mt-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />

          <span className="text-xs text-zinc-600">atau</span>

          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200"
        >
          <span className="text-lg font-bold">G</span>
          Continue with Google
        </button>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="font-medium text-blue-500 transition hover:text-blue-400"
          >
            Register
          </a>
        </p>
      </main>
    </section>
  );
}
