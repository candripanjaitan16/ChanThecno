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
  ArrowRight,
} from "lucide-react";

type DatabaseRecord = {
  id: string;
  name: string;
  engine: string;
  storage: number;
  status: "active";
  createdAt: string;
};

type DashboardStats = {
  projects: number;
  databases: number;
  storageUsed: number;
  storageLimit: number;
  status: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    databases: 0,
    storageUsed: 0,
    storageLimit: 1024,
    status: "active",
  });

  const [databases, setDatabases] = useState<DatabaseRecord[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Cek login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      router.replace("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  // Ambil data dashboard
  useEffect(() => {
    if (checkingAuth) return;

    const loadDashboard = async () => {
      try {
        setLoadingDashboard(true);

        const response = await fetch("/api/dashboard", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Gagal mengambil dashboard.");
        }

        setStats(data.stats);
        setDatabases(data.databases);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, [checkingAuth]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    router.replace("/");
  };

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
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-zinc-800 px-6">
            <h1 className="text-xl font-bold">
              <span className="text-blue-500">Chan</span>
              Thecno
            </h1>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-zinc-400 hover:text-white lg:hidden"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            <button
              onClick={() => {
                router.push("/akun/dashboard");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-blue-600/10 px-4 py-3 text-left text-blue-400"
            >
              <Home size={19} />
              Dashboard
            </button>

            <button
              onClick={() => {
                router.push("/akun/database");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <Database size={19} />
              Database
            </button>

            <button
              onClick={() => {
                router.push("/akun/storage");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <HardDrive size={19} />
              Storage
            </button>

            <button
              onClick={() => {
                router.push("/akun/projects");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <Folder size={19} />
              Projects
            </button>

            <button
              onClick={() => {
                router.push("/akun/settings");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <Settings size={19} />
              Settings
            </button>
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

        {/* Main */}
        <section className="min-w-0 flex-1">
          {/* Header */}
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

            <button
              onClick={() => router.push("/akun/database")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
            >
              <Plus size={18} />
              New Database
            </button>
          </header>

          {/* Content */}
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
              {/* Projects */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Projects</p>

                  <Folder size={20} className="text-blue-500" />
                </div>

                {loadingDashboard ? (
                  <div className="h-9 w-12 animate-pulse rounded bg-zinc-800" />
                ) : (
                  <p className="text-3xl font-bold">{stats.projects}</p>
                )}

                <p className="mt-2 text-xs text-zinc-600">
                  Project yang kamu buat
                </p>
              </div>

              {/* Databases */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Databases</p>

                  <Database size={20} className="text-blue-500" />
                </div>

                {loadingDashboard ? (
                  <div className="h-9 w-12 animate-pulse rounded bg-zinc-800" />
                ) : (
                  <p className="text-3xl font-bold">{stats.databases}</p>
                )}

                <p className="mt-2 text-xs text-zinc-600">Database aktif</p>
              </div>

              {/* Storage */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Storage</p>

                  <HardDrive size={20} className="text-blue-500" />
                </div>

                {loadingDashboard ? (
                  <div className="h-9 w-24 animate-pulse rounded bg-zinc-800" />
                ) : (
                  <p className="text-3xl font-bold">{stats.storageUsed} GB</p>
                )}

                <p className="mt-2 text-xs text-zinc-600">
                  Dari {stats.storageLimit} GB tersedia
                </p>
              </div>

              {/* Status */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Status</p>

                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>

                <p className="text-3xl font-bold capitalize">{stats.status}</p>

                <p className="mt-2 text-xs text-zinc-600">
                  Account berjalan normal
                </p>
              </div>
            </div>

            {/* Databases */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Recent Databases</h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Database yang kamu buat
                  </p>
                </div>

                {databases.length > 0 && (
                  <button
                    onClick={() => router.push("/akun/database")}
                    className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400"
                  >
                    View all
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {loadingDashboard ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
                  <p className="text-sm text-zinc-500">Memuat database...</p>
                </div>
              ) : databases.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center sm:p-12">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                    <Database size={26} />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    Belum ada database
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    Buat database pertama kamu untuk mulai menggunakan database
                    dan storage ChanThecno.
                  </p>

                  <button
                    onClick={() => router.push("/akun/database")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    <Plus size={18} />
                    Create Database
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {databases.slice(0, 5).map((database) => (
                    <button
                      key={database.id}
                      onClick={() =>
                        router.push(`/akun/database/${database.id}`)
                      }
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
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
