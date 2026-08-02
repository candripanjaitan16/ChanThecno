"use client";

import { ArrowLeft, Database, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DatabasePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex h-20 items-center justify-between border-b border-zinc-800 px-5 sm:px-8">
        <div>
          <p className="text-sm text-zinc-500">ChanThecno</p>
          <h1 className="text-lg font-semibold">Database</h1>
        </div>

        <button
          onClick={() => router.push("/akun/dashboard")}
          className="flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </header>

      <section className="p-5 sm:p-8">
        <div className="mb-8">
          <p className="text-sm text-blue-500">Database</p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight">
            Database kamu
          </h2>

          <p className="mt-2 text-zinc-500">
            Buat dan kelola database melalui ChanThecno.
          </p>
        </div>

        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Database size={30} />
          </div>

          <h3 className="mt-5 text-xl font-semibold">Belum ada database</h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Buat database pertama kamu untuk mulai menggunakan layanan database
            ChanThecno.
          </p>

          <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500">
            <Plus size={18} />
            Create Database
          </button>
        </div>
      </section>
    </main>
  );
}
