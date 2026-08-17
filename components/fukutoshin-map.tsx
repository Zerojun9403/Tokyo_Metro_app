"use client";

import { useState } from "react";

import { FukutoshinStationPanel } from "@/components/fukutoshin-station-panel";
import {
  FUKUTOSHIN_COLOR,
  FUKUTOSHIN_STATIONS,
  type FukutoshinStation,
} from "@/data/fukutoshin";

export function FukutoshinMap() {
  const [selectedStation, setSelectedStation] =
    useState<FukutoshinStation | null>(null);

  return (
    <>
      <section className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="border-b border-zinc-100 px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-sm"
                style={{ backgroundColor: FUKUTOSHIN_COLOR }}
              >
                F
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h1
                    lang="ja"
                    className="text-2xl font-black tracking-tight text-zinc-950"
                  >
                    副都心線
                  </h1>
                  <span className="text-sm font-semibold text-zinc-400">
                    Fukutoshin Line
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-zinc-500">
                  후쿠토신선 · 和光市 ↔ 渋谷
                </p>
              </div>
            </div>
            <div className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-500">
              F01–F16
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1500px] px-10 py-12">
            <div className="relative">
              <div
                className="absolute left-7 right-7 top-7 h-2 rounded-full"
                style={{ backgroundColor: FUKUTOSHIN_COLOR }}
              />
              <div
                className="relative grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${FUKUTOSHIN_STATIONS.length}, minmax(84px, 1fr))`,
                }}
              >
                {FUKUTOSHIN_STATIONS.map((station) => {
                  const selected = selectedStation?.id === station.id;
                  return (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => setSelectedStation(station)}
                      className="group flex min-w-0 flex-col items-center text-center"
                    >
                      <span
                        className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-[5px] bg-white text-xs font-black transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg ${
                          selected ? "scale-110 shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: FUKUTOSHIN_COLOR,
                          color: FUKUTOSHIN_COLOR,
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
        <FukutoshinStationPanel
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </>
  );
}
