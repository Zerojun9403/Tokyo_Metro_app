import Link from "next/link";
import { ArrowRight, Construction } from "lucide-react";

type MetroLineCardProps = {
  code: string;
  nameJa: string;
  nameKo: string;
  from: string;
  to: string;
  color: string;
  href?: string;
  ready?: boolean;
};

export function MetroLineCard({
  code,
  nameJa,
  nameKo,
  from,
  to,
  color,
  href,
  ready = false,
}: MetroLineCardProps) {
  const content = (
    <div
      className={`
        group
        relative
        h-full
        overflow-hidden
        rounded-[28px]
        border
        border-zinc-200
        bg-white
        p-5
        shadow-[0_4px_20px_rgba(0,0,0,0.035)]
        transition-all
        duration-200
        sm:p-6
        ${
          ready
            ? "cursor-pointer hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
            : "cursor-default opacity-70"
        }
      `}
    >
      {/* 상단 노선색 */}
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {/* 노선 코드 */}
          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              text-xl
              font-black
              text-white
              shadow-sm
            "
            style={{ backgroundColor: color }}
          >
            {code}
          </div>

          {/* 노선명 */}
          <div className="min-w-0">
            <h2
              lang="ja"
              className="text-xl font-black tracking-tight text-zinc-950"
            >
              {nameJa}
            </h2>

            <p lang="ko" className="mt-1 text-sm font-medium text-zinc-500">
              {nameKo}
            </p>
          </div>
        </div>

        {ready ? (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-zinc-100
              transition-all
              duration-200
              group-hover:bg-zinc-950
              group-hover:text-white
            "
          >
            <ArrowRight className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-500">
            <Construction className="h-3.5 w-3.5" />
            준비 중
          </div>
        )}
      </div>

      {/* 구간 */}
      <div className="mt-7 flex items-center gap-3">
        <span lang="ja" className="shrink-0 text-sm font-bold text-zinc-700">
          {from}
        </span>

        <div className="relative h-[2px] flex-1 bg-zinc-200">
          <div
            className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: color }}
          />

          <div
            className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>

        <span lang="ja" className="shrink-0 text-sm font-bold text-zinc-700">
          {to}
        </span>
      </div>

      {ready && (
        <p className="mt-5 text-xs font-medium text-zinc-400">
          역 정보 · 운행 정보 · 시간표
        </p>
      )}
    </div>
  );

  if (ready && href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
