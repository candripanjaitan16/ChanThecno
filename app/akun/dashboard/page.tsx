"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Database,
  Folder,
  HardDrive,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  X,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Cek apakah user masih login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      router.replace("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    router.replace("/");
  };

  // Jangan tampilkan dashboard sebelum pengecekan selesai
  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-zinc-500">Memeriksa sesi...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-zinc-800 px-6">
            <h1 className="text-xl font-bold">
              <span className="text-blue-500">Chan</span>Thecno
            </h1>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-zinc-400 hover:text-white lg:hidden"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            <a
              href="/akun/dashboard"
              className="flex items-center gap-3 rounded-xl bg-blue-600/10 px-4 py-3 text-blue-400"
            >
              <Home size={19} />
              Dashboard
            </a>

            <a
              href="/akun/database"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <Database size={19} />
              Database
            </a>

            <a
              href="/akun/storage"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <HardDrive size={19} />
              Storage
            </a>

            <a
              href="/akun/projects"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <Folder size={19} />
              Projects
            </a>

            <a
              href="/akun/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <Settings size={19} />
              Settings
            </a>
          </nav>

          {/* Account */}
          <div className="border-t border-zinc-800 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-zinc-900 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                <User size={18} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Candri Panjaitan</p>

                <p className="truncate text-xs text-zinc-500">
                  candri@example.com
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-zinc-800 px-5 sm:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="hidden lg:block">
              <p className="text-sm text-zinc-500">Dashboard</p>
              <h2 className="text-lg font-semibold">Overview</h2>
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500">
              <Plus size={18} />
              New Project
            </button>
          </header>

          <div className="p-5 sm:p-8">
            {/* Welcome */}
            <div className="mb-8">
              <p className="text-sm text-blue-500">Welcome back</p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Selamat datang di ChanThecno
              </h1>

              <p className="mt-2 text-zinc-500">
                Kelola database, storage, dan project kamu dari sini.
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Projects</p>
                  <Folder size={20} className="text-blue-500" />
                </div>

                <p className="text-3xl font-bold">0</p>

                <p className="mt-2 text-xs text-zinc-600">
                  Project yang kamu buat
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Databases</p>
                  <Database size={20} className="text-blue-500" />
                </div>

                <p className="text-3xl font-bold">0</p>

                <p className="mt-2 text-xs text-zinc-600">Database aktif</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Storage</p>
                  <HardDrive size={20} className="text-blue-500" />
                </div>

                <p className="text-3xl font-bold">0 MB</p>

                <p className="mt-2 text-xs text-zinc-600">Dari 1 GB tersedia</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Status</p>
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>

                <p className="text-3xl font-bold">Active</p>

                <p className="mt-2 text-xs text-zinc-600">
                  Account berjalan normal
                </p>
              </div>
            </div>

            {/* Empty project state */}
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <Database size={26} />
              </div>

              <h2 className="mt-5 text-xl font-semibold">Belum ada project</h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Buat project pertama kamu untuk mulai menggunakan database dan
                storage ChanThecno.
              </p>

              <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500">
                <Plus size={18} />
                Create Project
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
