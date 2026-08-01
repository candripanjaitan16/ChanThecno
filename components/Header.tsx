"use client";

import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Header() {
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setFixed(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`left-0 right-0 z-50 transition-all duration-300 ${
        fixed
          ? "fixed top-0 border-b border-zinc-800 bg-black/80 backdrop-blur-xl"
          : "absolute top-0"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-10">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-blue-500">Chan</span>Thecno
        </h1>

        <a
          href="https://github.com/candripanjaitan16/ChanThecno"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ChanThecno GitHub"
          className="text-white transition hover:text-blue-500"
        >
          <FaGithub size={25} />
        </a>
      </div>
    </header>
  );
}
