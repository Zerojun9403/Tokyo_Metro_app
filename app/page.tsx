import { TrainFront } from "lucide-react";

import { MetroLineCard } from "@/components/metro-line-card";

const METRO_LINES = [
  {
    code: "G",
    nameJa: "銀座線",
    nameKo: "긴자선",
    from: "渋谷",
    to: "浅草",
    color: "#FF9500",
    href: "/ginza",
    ready: true,
  },
  {
    code: "M",
    nameJa: "丸ノ内線",
    nameKo: "마루노우치선",
    from: "荻窪",
    to: "池袋",
    color: "#F62E36",
    href: "/marunouchi",
    ready: true,
  },
  {
    code: "H",
    nameJa: "日比谷線",
    nameKo: "히비야선",
    from: "北千住",
    to: "中目黒",
    color: "#B5B5AC",
    href: "/hibiya",
    ready: true,
  },
  {
    code: "T",
    nameJa: "東西線",
    nameKo: "도자이선",
    from: "中野",
    to: "西船橋",
    color: "#009BBF",
    href: "/tozai",
    ready: true,
  },
  {
    code: "C",
    nameJa: "千代田線",
    nameKo: "지요다선",
    from: "代々木上原",
    to: "北綾瀬",
    color: "#00BB85",
    ready: false,
  },
  {
    code: "Y",
    nameJa: "有楽町線",
    nameKo: "유라쿠초선",
    from: "和光市",
    to: "新木場",
    color: "#C1A470",
    ready: false,
  },
  {
    code: "Z",
    nameJa: "半蔵門線",
    nameKo: "한조몬선",
    from: "渋谷",
    to: "押上",
    color: "#8F76D6",
    ready: false,
  },
  {
    code: "N",
    nameJa: "南北線",
    nameKo: "난보쿠선",
    from: "目黒",
    to: "赤羽岩淵",
    color: "#00AC9B",
    ready: false,
  },
  {
    code: "F",
    nameJa: "副都心線",
    nameKo: "후쿠토신선",
    from: "和光市",
    to: "渋谷",
    color: "#9C5E31",
    ready: false,
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <TrainFront className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black tracking-[0.16em] text-zinc-400">
                TOKYO METRO
              </p>

              <p lang="ja" className="text-xs font-medium text-zinc-400">
                東京地下鉄
              </p>
            </div>
          </div>

          <div className="mt-9 max-w-3xl">
            <h1 className="text-4xl font-black tracking-[-0.04em] text-zinc-950 sm:text-5xl lg:text-6xl">
              도쿄 지하철을
              <br />
              <span className="text-zinc-400">조금 더 쉽게.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-zinc-500 sm:text-lg">
              노선을 선택해 역 정보, 환승 노선,
              <br className="hidden sm:block" />
              운행 상황과 다음 열차 시간표를 확인하세요.
            </p>
          </div>

          {/* 간단한 정보 */}

          <div className="mt-10 flex flex-wrap gap-2">
            <div className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-600">
              9개 노선
            </div>

            <div className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-600">
              실시간 운행정보
            </div>

            <div className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-600">
              역 시간표
            </div>

            <div className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-600">
              한국어 지원
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          LINES
      ================================================= */}

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
              Lines
            </p>

            <div className="mt-2 flex items-baseline gap-3">
              <h2 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
                노선 선택
              </h2>

              <span lang="ja" className="text-sm font-medium text-zinc-400">
                路線を選択
              </span>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              이용할 노선을 선택하세요.
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-2xl font-black text-zinc-950">9</p>

            <p className="text-xs font-medium text-zinc-400">
              Tokyo Metro Lines
            </p>
          </div>
        </div>

        {/* 노선 카드 */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {METRO_LINES.map((line) => (
            <MetroLineCard
              key={line.code}
              code={line.code}
              nameJa={line.nameJa}
              nameKo={line.nameKo}
              from={line.from}
              to={line.to}
              color={line.color}
              href={"href" in line ? line.href : undefined}
              ready={line.ready}
            />
          ))}
        </div>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-black text-zinc-800">
              Tokyo Metro Guide
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Tokyo railway information project
            </p>
          </div>

          <p className="text-xs text-zinc-400">Powered by ODPT Open Data</p>
        </div>
      </footer>
    </main>
  );
}
