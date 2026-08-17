"use client";

import { useState } from "react";

import { TozaiStationPanel } from "@/components/tozai-station-panel";

import { TOZAI_COLOR, TOZAI_STATIONS, type TozaiStation } from "@/data/tozai";

type TozaiMapProps = {
  onStationSelect?: (station: TozaiStation) => void;
};

export function TozaiMap({ onStationSelect }: TozaiMapProps) {
  const [selectedStation, setSelectedStation] = useState<TozaiStation | null>(
    null,
  );

  const handleStationClick = (station: TozaiStation) => {
    setSelectedStation(station);
    onStationSelect?.(station);
  };

  return (
    <>
      <section className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="border-b border-zinc-100 px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-sm"
                style={{ backgroundColor: TOZAI_COLOR }}
              >
                T
              </div>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h1
                    lang="ja"
                    className="text-2xl font-black tracking-tight text-zinc-950"
                  >
                    東西線
                  </h1>

                  <span className="text-sm font-semibold text-zinc-400">
                    Tozai Line
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-zinc-500">
                  도자이선 · 中野 ↔ 西船橋
                </p>
              </div>
            </div>

            <div className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-500">
              T01–T23
            </div>
          </div>
        </div>

        {/* Route map */}
        <div className="overflow-x-auto">
          <div className="min-w-[2000px] px-10 py-12">
            <div className="relative">
              {/* Line */}
              <div
                className="absolute left-7 right-7 top-7 h-2 rounded-full"
                style={{ backgroundColor: TOZAI_COLOR }}
              />

              {/* Stations */}
              <div
                className="relative grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${TOZAI_STATIONS.length}, minmax(76px, 1fr))`,
                }}
              >
                {TOZAI_STATIONS.map((station) => {
                  const selected = selectedStation?.id === station.id;

                  return (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => handleStationClick(station)}
                      className="group flex min-w-0 flex-col items-center text-center"
                      aria-label={`${station.nameKo} ${station.code}`}
                    >
                      <span
                        className={`
                        relative z-10
                        flex h-14 w-14
                        items-center justify-center
                        rounded-full
                        border-[5px]
                        bg-white
                        text-xs font-black
                        transition-all duration-200
                        group-hover:-translate-y-1
                        group-hover:shadow-lg
                        ${selected ? "scale-110 shadow-lg" : ""}
                      `}
                        style={{
                          borderColor: TOZAI_COLOR,
                          color: TOZAI_COLOR,
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

            {/* Footer */}
            <div className="mt-10 flex items-center justify-between border-t border-zinc-100 pt-6">
              <p className="text-xs font-medium text-zinc-400">
                역을 선택하면 상세 정보를 확인할 수 있습니다.
              </p>

              {selectedStation && (
                <p className="text-xs font-bold text-zinc-600">
                  선택됨 · {selectedStation.code} {selectedStation.nameJa}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedStation && (
        <TozaiStationPanel
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </>
  );
}
