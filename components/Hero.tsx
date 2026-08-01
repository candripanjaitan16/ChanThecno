import Link from "next/link";

export default function Hero() {
  return (
    <>
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 z-0 h-full w-full object-cover opacity-50"
        >
          <source src="/video/bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

        <div className="relative top-60 z-10 flex h-full flex-col items-start px-10 text-white">
          <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 backdrop-blur-md">
            Cloud Database Platform
          </span>

          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Selamat Datang di <span className="text-blue-500">ChanThecno</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">
            Solusi teknologi masa kini untuk menyimpan, mengelola, dan
            mengembangkan data kamu dengan mudah.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Get Started
            </Link>

            <button className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/10">
              Documentation
            </button>
          </div>
        </div>
      </section>

      <section className="relative bg-black px-10 py-32 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="text-sm font-medium uppercase tracking-widest text-blue-500">
              Why ChanThecno?
            </span>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Kenapa menggunakan ChanThecno?
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Kami ingin membuat pengelolaan database menjadi lebih sederhana,
              sehingga developer dapat fokus membangun aplikasi tanpa harus
              memikirkan infrastruktur yang rumit.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
              <h3 className="text-xl font-semibold">Simple</h3>

              <p className="mt-3 leading-7 text-zinc-400">
                Buat dan kelola database tanpa konfigurasi yang rumit.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
              <h3 className="text-xl font-semibold">Fast</h3>

              <p className="mt-3 leading-7 text-zinc-400">
                Infrastruktur dirancang agar database dapat digunakan dengan
                cepat.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
              <h3 className="text-xl font-semibold">Developer First</h3>

              <p className="mt-3 leading-7 text-zinc-400">
                Dibuat untuk developer yang ingin fokus pada aplikasi, bukan
                mengurus server.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
