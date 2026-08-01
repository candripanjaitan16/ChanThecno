"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const sendOtp = async () => {
    if (!email) {
      alert("Masukkan email terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Gagal mengirim OTP.");
        return;
      }

      alert("Kode OTP berhasil dikirim ke email kamu!");
      setVerified(true);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Hanya izinkan angka
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Pindah otomatis ke kotak berikutnya
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!verified) {
      alert("Verifikasi email terlebih dahulu.");
      return;
    }

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      alert("Masukkan 6 digit kode OTP.");
      return;
    }

    if (!name || !email || !password) {
      alert("Lengkapi semua data terlebih dahulu.");
      return;
    }

    // Testing sementara.
    // Nanti akan diganti dengan proses pembuatan akun di database.
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);

    router.replace("/akun/dashboard");
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-black px-6 py-10 text-white">
      <main className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium text-blue-500">ChanThecno</p>

          <h1 className="text-3xl font-bold">Create an account</h1>

          <p className="mt-2 text-sm text-zinc-400">
            Daftar untuk mulai menggunakan ChanThecno.
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Nama */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Nama Lengkap</label>

            <input
              type="text"
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              className="rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Email</label>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading || verified}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  verified
                    ? "bg-green-500/10 text-green-400"
                    : "bg-blue-600 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                }`}
              >
                {loading ? "Mengirim..." : verified ? "Terkirim" : "Verifikasi"}
              </button>
            </div>
          </div>

          {/* OTP */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Kode OTP</label>

            <div className="flex justify-between gap-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  disabled={!verified}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="h-12 w-12 rounded-xl border border-zinc-800 bg-black text-center text-lg font-semibold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                />
              ))}
            </div>

            <p className="text-xs text-zinc-600">
              Masukkan 6 digit kode yang dikirim ke email kamu.
            </p>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Password</label>

            <input
              type="password"
              placeholder="Buat password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Register */}
          <button
            type="submit"
            className="mt-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        {/* Login */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="font-medium text-blue-500 transition hover:text-blue-400"
          >
            Login
          </a>
        </p>
      </main>
    </section>
  );
}
