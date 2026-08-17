"use client";

import { useState } from "react";

import { GinzaStationPanel } from "@/components/ginza-station-panel";
import { GINZA_COLOR, GINZA_STATIONS, type GinzaStation } from "@/data/ginza";

export function GinzaMap() {
  const [selectedStation, setSelectedStation] = useState<GinzaStation | null>(
    null,
  );

  return (
    <>
      <section className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
        {/* 노선 헤더 */}
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-black text-white"
              style={{ backgroundColor: GINZA_COLOR }}
            >
              G
            </div>

            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="text-2xl font-black text-zinc-950 md:text-3xl">
                  東京メトロ銀座線
                </h1>

                <span className="text-sm text-zinc-400">
                  Tokyo Metro Ginza Line
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-zinc-600">
                도쿄메트로 긴자선
              </p>
            </div>
          </div>
        </div>

        {/* 노선 구간 */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Ginza Line
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-zinc-950 md:text-2xl">
                渋谷
                <span className="mx-3 text-zinc-300">—</span>
                浅草
              </h2>

              <p className="mt-1 text-sm text-zinc-500">시부야 · 아사쿠사</p>
            </div>

            <p className="text-sm font-semibold text-zinc-500">G01 — G19</p>
          </div>
        </div>

        {/* 방향 안내 */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-zinc-950">← 渋谷方面</p>

            <p className="mt-1 text-xs text-zinc-500">시부야 방면</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-black text-zinc-950">浅草方面 →</p>

            <p className="mt-1 text-xs text-zinc-500">아사쿠사 방면</p>
          </div>
        </div>

        {/* 긴자선 노선도 */}
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[1500px] px-4">
            <div className="relative">
              {/* 긴자선 주황색 선 */}
              <div
                className="absolute left-0 right-0 top-[22px] h-[6px] rounded-full"
                style={{ backgroundColor: GINZA_COLOR }}
              />

              {/* 역 목록 */}
              <div
                className="relative grid"
                style={{
                  gridTemplateColumns: `repeat(${GINZA_STATIONS.length}, minmax(0, 1fr))`,
                }}
              >
                {GINZA_STATIONS.map((station) => {
                  const selected = selectedStation?.id === station.id;

                  return (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => setSelectedStation(station)}
                      aria-label={`${station.ja} ${station.ko} 역 정보`}
                      className="group flex min-w-0 flex-col items-center"
                    >
                      {/* 역 번호 */}
                      <div
                        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-[4px] bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-md ${
                          selected ? "scale-110 shadow-md" : ""
                        }`}
                        style={{
                          borderColor: GINZA_COLOR,
                        }}
                      >
                        <span className="text-[11px] font-black text-zinc-950">
                          {station.code}
                        </span>
                      </div>

                      {/* 역 이름 */}
                      <div className="mt-4 w-full px-1 text-center">
                        <p
                          lang="ja"
                          className="whitespace-nowrap text-sm font-black text-zinc-950"
                        >
                          {station.ja}
                        </p>

                        <p
                          lang="ko"
                          className="mt-1 whitespace-nowrap text-[11px] font-medium text-zinc-500"
                        >
                          {station.ko}
                        </p>

                        <p
                          lang="en"
                          className="mt-0.5 whitespace-nowrap text-[10px] text-zinc-400"
                        >
                          {station.en}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 안내 */}
        <div className="mt-4 border-t border-zinc-100 pt-5">
          <p className="text-xs leading-6 text-zinc-400">
            역을 선택하면 실제 Tokyo Metro 역 정보와 환승 노선을 확인할 수
            있습니다.
          </p>
        </div>
      </section>

      {/* 역 상세 패널 */}
      {selectedStation && (
        <GinzaStationPanel
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </>
  );
}
