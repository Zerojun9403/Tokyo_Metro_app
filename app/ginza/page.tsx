import Link from "next/link";

import { GinzaMap } from "@/components/ginza-map";

export default function GinzaPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-[1700px] px-4 py-8 md:px-8 md:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-bold text-zinc-500 transition hover:text-zinc-950"
        >
          ← 東京メトロ
        </Link>

        <GinzaMap />
      </div>
    </main>
  );
}
