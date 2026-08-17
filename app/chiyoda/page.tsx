import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ChiyodaMap } from "@/components/chiyoda-map";

export default function ChiyodaPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" />
            메인으로
          </Link>

          <div className="text-right">
            <p className="text-sm font-black tracking-tight text-zinc-900">
              Tokyo Metro Guide
            </p>
            <p lang="ja" className="mt-0.5 text-xs font-medium text-zinc-400">
              東京メトロ
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-8 sm:py-8">
        <ChiyodaMap />
      </section>
    </main>
  );
}
