"use client";

import { ArrowLeft, Database, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DatabaseRecord = {
  id: string;
  name: string;
  engine: string;
  storage: number;
  status: "active";
  createdAt: string;
};

export default function DatabasePage() {
  const router = useRouter();

  const [databases, setDatabases] = useState<DatabaseRecord[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [engine, setEngine] = useState("PostgreSQL");
  const [storage, setStorage] = useState("10");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/database")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDatabases(data.databases);
        }
      })
      .catch(() => {
        setError("Gagal mengambil data database.");
      });
  }, []);

  const handleCreateDatabase = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          engine,
          storage: Number(storage),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal membuat database.");
        return;
      }

      setDatabases((current) => [...current, data.database]);

      setName("");
      setEngine("PostgreSQL");
      setStorage("10");
      setShowForm(false);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-blue-500">Database</p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight">
              Database kamu
            </h2>

            <p className="mt-2 text-zinc-500">
              Buat dan kelola database melalui ChanThecno.
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setError("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            <Plus size={18} />
            Create Database
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Create Database</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Buat database baru di ChanThecno.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDatabase} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Database Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="contoh: toko_online"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Database Engine
                </label>

                <select
                  value={engine}
                  onChange={(event) => setEngine(event.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-600"
                >
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MySQL">MySQL</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Storage (GB)
                </label>

                <input
                  type="number"
                  min="1"
                  value={storage}
                  onChange={(event) => setStorage(event.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Database"}
              </button>
            </form>
          </div>
        )}

        {databases.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Database size={30} />
            </div>

            <h3 className="mt-5 text-xl font-semibold">Belum ada database</h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Buat database pertama kamu untuk mulai menggunakan layanan
              database ChanThecno.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {databases.map((database) => (
              <button
                key={database.id}
                onClick={() => router.push(`/akun/database/${database.id}`)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-left transition hover:border-blue-600 hover:bg-zinc-900"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <Database size={22} />
                    </div>

                    <div>
                      <h3 className="font-semibold">{database.name}</h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {database.engine} • {database.storage} GB
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                    {database.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
