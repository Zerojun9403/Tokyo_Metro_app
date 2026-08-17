"use client";

import { useState } from "react";

import { MarunouchiStationPanel } from "@/components/marunouchi-station-panel";
import {
  MARUNOUCHI_BRANCH_STATIONS,
  MARUNOUCHI_COLOR,
  MARUNOUCHI_MAIN_STATIONS,
  type MarunouchiStation,
} from "@/data/marunouchi";

export function MarunouchiMap() {
  const [selectedStation, setSelectedStation] =
    useState<MarunouchiStation | null>(null);

  return (
    <>
      <section className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="border-b border-zinc-100 px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-sm"
                style={{ backgroundColor: MARUNOUCHI_COLOR }}
              >
                M
              </div>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h1
                    lang="ja"
                    className="text-2xl font-black tracking-tight text-zinc-950"
                  >
                    丸ノ内線
                  </h1>
                  <span className="text-sm font-semibold text-zinc-400">
                    Marunouchi Line
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-zinc-500">
                  마루노우치선 · 荻窪 / 方南町 ↔ 池袋
                </p>
              </div>
            </div>

            <div className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-500">
              M01–M25 · Mb03–Mb05
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[2100px] px-10 py-12">
            <div className="relative">
              <div
                className="absolute left-7 right-7 top-7 h-2 rounded-full"
                style={{ backgroundColor: MARUNOUCHI_COLOR }}
              />

              <div
                className="relative grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${MARUNOUCHI_MAIN_STATIONS.length}, minmax(72px, 1fr))`,
                }}
              >
                {MARUNOUCHI_MAIN_STATIONS.map((station) => (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => setSelectedStation(station)}
                    className="group flex min-w-0 flex-col items-center text-center"
                  >
                    <span
                      className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-[5px] bg-white text-xs font-black transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
                      style={{
                        borderColor: MARUNOUCHI_COLOR,
                        color: MARUNOUCHI_COLOR,
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
                    <span className="mt-1 whitespace-nowrap text-[11px] font-medium text-zinc-500">
                      {station.nameKo}
                    </span>

                    {station.id === "NakanoSakaue" && (
                      <span
                        className="mt-2 rounded-full px-2 py-1 text-[10px] font-black text-white"
                        style={{ backgroundColor: MARUNOUCHI_COLOR }}
                      >
                        方南町支線
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative ml-[350px] mt-8 w-[390px]">
              <div
                className="absolute -top-8 right-3 h-8 w-2"
                style={{ backgroundColor: MARUNOUCHI_COLOR }}
              />
              <div
                className="absolute left-7 right-7 top-7 h-2 rounded-full"
                style={{ backgroundColor: MARUNOUCHI_COLOR }}
              />

              <div className="relative grid grid-cols-3 gap-8">
                {[...MARUNOUCHI_BRANCH_STATIONS].reverse().map((station) => (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => setSelectedStation(station)}
                    className="group flex min-w-0 flex-col items-center text-center"
                  >
                    <span
                      className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-[5px] bg-white text-[11px] font-black transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
                      style={{
                        borderColor: MARUNOUCHI_COLOR,
                        color: MARUNOUCHI_COLOR,
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
                    <span className="mt-1 whitespace-nowrap text-[11px] font-medium text-zinc-500">
                      {station.nameKo}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 text-center">
                <span
                  className="rounded-full px-3 py-1.5 text-xs font-black text-white"
                  style={{ backgroundColor: MARUNOUCHI_COLOR }}
                >
                  方南町支線 · 호난초 지선
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedStation && (
        <MarunouchiStationPanel
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </>
  );
}
