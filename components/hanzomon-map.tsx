"use client";

import { useState } from "react";

import { HanzomonStationPanel } from "@/components/hanzomon-station-panel";
import {
  HANZOMON_COLOR,
  HANZOMON_STATIONS,
  type HanzomonStation,
} from "@/data/hanzomon";

export function HanzomonMap() {
  const [selectedStation, setSelectedStation] =
    useState<HanzomonStation | null>(null);

  return (
    <>
      <section className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="border-b border-zinc-100 px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-sm"
                style={{ backgroundColor: HANZOMON_COLOR }}
              >
                Z
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h1
                    lang="ja"
                    className="text-2xl font-black tracking-tight text-zinc-950"
                  >
                    半蔵門線
                  </h1>
                  <span className="text-sm font-semibold text-zinc-400">
                    Hanzomon Line
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-zinc-500">
                  한조몬선 · 渋谷 ↔ 押上〈スカイツリー前〉
                </p>
              </div>
            </div>
            <div className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-500">
              Z01–Z14
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1350px] px-10 py-12">
            <div className="relative">
              <div
                className="absolute left-7 right-7 top-7 h-2 rounded-full"
                style={{ backgroundColor: HANZOMON_COLOR }}
              />
              <div
                className="relative grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${HANZOMON_STATIONS.length}, minmax(84px, 1fr))`,
                }}
              >
                {HANZOMON_STATIONS.map((station) => {
                  const selected = selectedStation?.id === station.id;
                  return (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => setSelectedStation(station)}
                      className="group flex min-w-0 flex-col items-center text-center"
                    >
                      <span
                        className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-[5px] bg-white text-xs font-black transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg ${selected ? "scale-110 shadow-lg" : ""}`}
                        style={{
                          borderColor: HANZOMON_COLOR,
                          color: HANZOMON_COLOR,
                        }}
                      >
                        {station.code}
                      </span>
                      <span
                        lang="ja"
                        className="mt-4 whitespace-nowrap text-sm font-black text-zinc-950"
                      >
                        {station.nameJa}
                      </span>
                      <span
                        lang="ko"
                        className="mt-1 whitespace-nowrap text-[11px] font-medium text-zinc-500"
                      >
                        {station.nameKo}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedStation && (
        <HanzomonStationPanel
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </>
  );
}
