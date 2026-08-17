"use client";

import { ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { RAILWAY_INFO } from "@/data/railway-info";

type RailwayCardProps = {
  railway: string;
  connectingStation?: string | null;
  showArrow?: boolean;
};

export function RailwayCard({
  railway,
  connectingStation,
  showArrow = true,
}: RailwayCardProps) {
  const info = RAILWAY_INFO[railway];

  // 아직 railway-info.ts에 등록되지 않은 노선
  if (!info) {
    return (
      <Card className="rounded-3xl border-zinc-200 bg-white shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-400 text-lg font-black text-white">
            ?
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-lg font-black text-zinc-950">{railway}</p>

            <p className="mt-1 text-sm text-zinc-500">노선 정보 확인 필요</p>
          </div>

          {showArrow && (
            <ChevronRight className="h-5 w-5 shrink-0 text-zinc-300" />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="
        group
        overflow-hidden
        rounded-3xl
        border-zinc-200
        bg-white
        shadow-[0_3px_16px_rgba(0,0,0,0.035)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-zinc-300
        hover:shadow-md
      "
    >
      <CardContent className="p-5">
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
              text-base
              font-black
              text-white
              shadow-sm
            "
            style={{
              backgroundColor: info.color,
            }}
          >
            {info.code}
          </div>

          {/* 노선 정보 */}

          <div className="min-w-0 flex-1">
            <p
              lang="ja"
              className="
                break-keep
                text-lg
                font-black
                leading-6
                tracking-tight
                text-zinc-950
              "
            >
              {info.ja}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <p
                lang="ko"
                className="break-keep text-sm font-medium text-zinc-500"
              >
                {info.ko}
              </p>

              <span className="text-zinc-300">·</span>

              <p lang="ja" className="text-sm text-zinc-400">
                {info.operator}
              </p>
            </div>

            {/* 다른 역과 연결되는 경우 */}

            {connectingStation && (
              <div className="mt-3">
                <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-500">
                  연결역 · {connectingStation}
                </span>
              </div>
            )}
          </div>

          {/* 화살표 */}

          {showArrow && (
            <ChevronRight
              className="
                h-5
                w-5
                shrink-0
                text-zinc-300
                transition-transform
                duration-200
                group-hover:translate-x-1
                group-hover:text-zinc-500
              "
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
