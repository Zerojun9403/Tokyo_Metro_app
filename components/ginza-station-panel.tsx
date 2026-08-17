"use client";

import { useEffect, useState } from "react";
import { RailwayCard } from "@/components/railway-card";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CircleAlert,
  RefreshCw,
  TrainFront,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import { GINZA_COLOR, type GinzaStation } from "@/data/ginza";

/* =========================================================
   API Types
========================================================= */

type ConnectingRailway = {
  id: string;
  railway: string | null;
};

type ConnectingStation = {
  id: string;
  station: string | null;
};

type StationApiResponse = {
  id: string;
  operator: string;
  railway: string | null;

  station: {
    code: string | null;
    ja: string | null;
    hiragana: string | null;
    en: string | null;
    ko: string | null;
  };

  location: {
    latitude: number | null;
    longitude: number | null;
  };

  connectingRailways: ConnectingRailway[];
  connectingStations: ConnectingStation[];

  timetableIds: string[];
};

type TrainInformation = {
  railway: string;
  normal: boolean;
  status: string | null;
  text: string | null;
  cause: string | null;
  updatedAt: string | null;
  validUntil: string | null;
};

type UpcomingTrain = {
  departureTime: string | null;
  minutesUntilDeparture: number | null;
  trainNumber: string | null;
  trainType: string | null;
  destinationStations: (string | null)[];
  train: string | null;
};

type TimetableDirection = {
  direction: string | null;
  railway: string | null;
  station: string | null;
  calendar: string | null;
  timetableCount: number;
  upcoming: UpcomingTrain[];
};

type StationTimetableResponse = {
  railway: string;
  station: string;
  currentTime: { timezone: string; hour: number; minute: number };
  calendar: string;
  totalTimetableCount: number;
  todayTimetableCount: number;
  directionCount: number;
  directions: TimetableDirection[];
};

type GinzaStationPanelProps = {
  station: GinzaStation;
  onClose: () => void;
};

/* =========================================================
   Helpers
========================================================= */

function getConnectingStation(
  railway: string | null,
  stations: ConnectingStation[],
) {
  if (!railway) {
    return null;
  }

  const match = stations.find((item) =>
    item.id.includes(`TokyoMetro.${railway}.`),
  );

  return match?.station ?? null;
}

function formatTokyoTime(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/* =========================================================
   Component
========================================================= */

export function GinzaStationPanel({
  station,
  onClose,
}: GinzaStationPanelProps) {
  const [data, setData] = useState<StationApiResponse | null>(null);

  const [trainInformation, setTrainInformation] =
    useState<TrainInformation | null>(null);

  const [timetable, setTimetable] = useState<StationTimetableResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     API
  ======================================================= */

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        setData(null);
        setTrainInformation(null);
        setTimetable(null);

        const params = new URLSearchParams({
          railway: "Ginza",
          station: station.id,
        });

        const [stationResponse, trainInformationResponse, timetableResponse] =
          await Promise.all([
            fetch(`/api/station?${params.toString()}`, {
              cache: "no-store",
              signal: controller.signal,
            }),

            fetch("/api/train-information?railway=Ginza", {
              cache: "no-store",
              signal: controller.signal,
            }),

            fetch(
              `/api/station-timetable?railway=Ginza&station=${encodeURIComponent(station.id)}`,
              {
                cache: "no-store",
                signal: controller.signal,
              },
            ),
          ]);

        if (!stationResponse.ok) {
          throw new Error(
            `역 정보를 불러오지 못했습니다. (${stationResponse.status})`,
          );
        }

        const stationResult =
          (await stationResponse.json()) as StationApiResponse;

        setData(stationResult);

        if (trainInformationResponse.ok) {
          const trainResult =
            (await trainInformationResponse.json()) as TrainInformation;

          setTrainInformation(trainResult);
        }

        if (timetableResponse.ok) {
          const timetableResult =
            (await timetableResponse.json()) as StationTimetableResponse;

          setTimetable(timetableResult);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "역 정보를 불러오지 못했습니다.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [station.id]);

  const updatedTime = formatTokyoTime(trainInformation?.updatedAt ?? null);

  const stationCode = data?.station.code ?? station.code;

  const shibuyaTimetable = timetable?.directions.find(
    (item) => item.direction === "Shibuya",
  );

  const asakusaTimetable = timetable?.directions.find(
    (item) => item.direction === "Asakusa",
  );

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent
        side="right"
        className="
    w-full
    overflow-y-auto
    border-l
    border-zinc-200
    bg-[#fcfcfc]
    p-0
    sm:!w-[45vw]
    sm:!max-w-[900px]
  "
      >
        {/* Ginza line accent */}

        <div
          className="sticky top-0 z-20 h-1.5 w-full"
          style={{ backgroundColor: GINZA_COLOR }}
        />

        <div className="px-5 pb-12 pt-7 sm:px-8 lg:px-10">
          {/* =================================================
              HEADER
          ================================================= */}

          <SheetHeader className="text-left">
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Station number */}

              <div
                className="
                  flex
                  h-[76px]
                  w-[76px]
                  shrink-0
                  flex-col
                  items-center
                  justify-center
                  rounded-full
                  border-[6px]
                  bg-white
                  shadow-[0_4px_18px_rgba(0,0,0,0.06)]
                  sm:h-[88px]
                  sm:w-[88px]
                "
                style={{
                  borderColor: GINZA_COLOR,
                }}
              >
                <span className="text-sm font-black leading-none text-zinc-900">
                  G
                </span>

                <span className="mt-1 text-2xl font-black leading-none text-zinc-950">
                  {stationCode.replace("G", "")}
                </span>
              </div>

              {/* Station name */}

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <SheetTitle
                    lang="ja"
                    className="
                      text-3xl
                      font-black
                      tracking-[-0.04em]
                      text-zinc-950
                      sm:text-4xl
                    "
                  >
                    {data?.station.ja ?? station.ja}
                  </SheetTitle>

                  {data?.station.hiragana && (
                    <span
                      lang="ja"
                      className="text-sm font-medium text-zinc-400"
                    >
                      {data.station.hiragana}
                    </span>
                  )}
                </div>

                <SheetDescription className="mt-2.5 text-sm font-medium text-zinc-500 sm:text-base">
                  <span lang="en">{data?.station.en ?? station.en}</span>

                  <span className="mx-2 text-zinc-300">/</span>

                  <span lang="ko">{data?.station.ko ?? station.ko}</span>
                </SheetDescription>

                <div className="mt-4">
                  <Badge
                    variant="secondary"
                    className="
                      gap-2
                      rounded-full
                      border
                      border-orange-100
                      bg-orange-50
                      px-3
                      py-1.5
                      font-bold
                      text-orange-700
                      hover:bg-orange-50
                    "
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: GINZA_COLOR,
                      }}
                    />
                    東京メトロ銀座線
                  </Badge>
                </div>
              </div>
            </div>
          </SheetHeader>

          <Separator className="my-8" />

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="space-y-5">
              <Skeleton className="h-32 w-full rounded-3xl" />

              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-32 rounded-3xl" />
                <Skeleton className="h-32 rounded-3xl" />
              </div>

              <Skeleton className="h-24 rounded-3xl" />
              <Skeleton className="h-24 rounded-3xl" />
              <Skeleton className="h-24 rounded-3xl" />
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <Card className="rounded-3xl border-red-200 bg-red-50 shadow-none">
              <CardContent className="flex gap-3 p-5">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <div>
                  <p className="font-bold text-red-700">
                    정보를 불러오지 못했습니다.
                  </p>

                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && data && (
            <>
              {/* =================================================
                  OPERATION STATUS
              ================================================= */}

              {trainInformation && (
                <section>
                  <div
                    className={`
                      rounded-3xl
                      border
                      p-5
                      sm:p-6
                      ${
                        trainInformation.normal
                          ? "border-emerald-200 bg-emerald-50/70"
                          : "border-amber-200 bg-amber-50/80"
                      }
                    `}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`
                            mt-2
                            h-3
                            w-3
                            shrink-0
                            rounded-full
                            ${
                              trainInformation.normal
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }
                          `}
                        />

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              lang="ja"
                              className={`
                                text-xl
                                font-black
                                ${
                                  trainInformation.normal
                                    ? "text-emerald-800"
                                    : "text-amber-800"
                                }
                              `}
                            >
                              {trainInformation.status ?? "運行情報"}
                            </p>

                            <Badge
                              className={
                                trainInformation.normal
                                  ? "border-0 bg-emerald-100 text-emerald-700 shadow-none hover:bg-emerald-100"
                                  : "border-0 bg-amber-100 text-amber-700 shadow-none hover:bg-amber-100"
                              }
                            >
                              {trainInformation.normal
                                ? "정상 운행"
                                : "운행 영향"}
                            </Badge>
                          </div>

                          <p
                            className={`
                              mt-1
                              text-sm
                              font-semibold
                              ${
                                trainInformation.normal
                                  ? "text-emerald-700"
                                  : "text-amber-700"
                              }
                            `}
                          >
                            {trainInformation.normal
                              ? "현재 정상적으로 운행하고 있습니다."
                              : "현재 운행에 영향이 있습니다."}
                          </p>
                        </div>
                      </div>

                      {updatedTime && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                          <RefreshCw className="h-3.5 w-3.5" />

                          <span>{updatedTime}</span>

                          <span lang="ja">更新</span>
                        </div>
                      )}
                    </div>

                    {trainInformation.text && (
                      <>
                        <Separator className="my-5 bg-black/5" />

                        <p
                          lang="ja"
                          className="text-sm font-medium leading-7 text-zinc-700"
                        >
                          {trainInformation.text}
                        </p>
                      </>
                    )}

                    {trainInformation.cause && (
                      <p className="mt-3 text-xs font-semibold text-zinc-500">
                        原因 · {trainInformation.cause}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* =================================================
                  DIRECTION
              ================================================= */}

              <section className="mt-9">
                <div className="mb-4">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-xl font-black tracking-tight text-zinc-950">
                      운행 방향
                    </h3>

                    <span className="text-sm text-zinc-400">Direction</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Shibuya */}

                  <Card
                    className="
                      rounded-3xl
                      border-zinc-200
                      bg-white
                      shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                      transition-all
                      hover:-translate-y-0.5
                      hover:border-orange-200
                      hover:shadow-md
                    "
                  >
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-center gap-3">
                        <ArrowLeft className="h-5 w-5 text-zinc-600" />

                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: GINZA_COLOR,
                          }}
                        />

                        <span
                          className="text-sm font-black"
                          style={{
                            color: GINZA_COLOR,
                          }}
                        >
                          G01
                        </span>
                      </div>

                      <p
                        lang="ja"
                        className="mt-5 text-xl font-black tracking-tight text-zinc-950"
                      >
                        渋谷方面
                      </p>

                      <p
                        lang="ko"
                        className="mt-1 text-sm font-medium text-zinc-500"
                      >
                        시부야 방면
                      </p>

                      <Separator className="my-5" />

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                          次の電車 · 다음 열차
                        </p>

                        <div className="mt-3 space-y-2">
                          {shibuyaTimetable?.upcoming.length ? (
                            shibuyaTimetable.upcoming.map((train) => (
                              <div
                                key={`${train.trainNumber}-${train.departureTime}`}
                                className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-3 py-2.5"
                              >
                                <div className="min-w-0">
                                  <span className="text-base font-black text-zinc-950">
                                    {train.departureTime}
                                  </span>
                                  <span className="ml-2 text-xs font-medium text-zinc-500">
                                    {train.destinationStations[0] ?? "Shibuya"}
                                    행
                                  </span>
                                </div>
                                {train.minutesUntilDeparture !== null && (
                                  <Badge
                                    variant="secondary"
                                    className="shrink-0 rounded-full"
                                  >
                                    {train.minutesUntilDeparture}분 후
                                  </Badge>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-zinc-400">
                              다음 열차 정보가 없습니다.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Asakusa */}

                  <Card
                    className="
                      rounded-3xl
                      border-zinc-200
                      bg-white
                      shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                      transition-all
                      hover:-translate-y-0.5
                      hover:border-orange-200
                      hover:shadow-md
                    "
                  >
                    <CardContent className="p-5 text-right sm:p-6">
                      <div className="flex items-center justify-end gap-3">
                        <span
                          className="text-sm font-black"
                          style={{
                            color: GINZA_COLOR,
                          }}
                        >
                          G19
                        </span>

                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: GINZA_COLOR,
                          }}
                        />

                        <ArrowRight className="h-5 w-5 text-zinc-600" />
                      </div>

                      <p
                        lang="ja"
                        className="mt-5 text-xl font-black tracking-tight text-zinc-950"
                      >
                        浅草方面
                      </p>

                      <p
                        lang="ko"
                        className="mt-1 text-sm font-medium text-zinc-500"
                      >
                        아사쿠사 방면
                      </p>

                      <Separator className="my-5" />

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                          次の電車 · 다음 열차
                        </p>

                        <div className="mt-3 space-y-2">
                          {asakusaTimetable?.upcoming.length ? (
                            asakusaTimetable.upcoming.map((train) => (
                              <div
                                key={`${train.trainNumber}-${train.departureTime}`}
                                className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-3 py-2.5 text-left"
                              >
                                <div className="min-w-0">
                                  <span className="text-base font-black text-zinc-950">
                                    {train.departureTime}
                                  </span>
                                  <span className="ml-2 text-xs font-medium text-zinc-500">
                                    {train.destinationStations[0] ?? "Asakusa"}
                                    행
                                  </span>
                                </div>
                                {train.minutesUntilDeparture !== null && (
                                  <Badge
                                    variant="secondary"
                                    className="shrink-0 rounded-full"
                                  >
                                    {train.minutesUntilDeparture}분 후
                                  </Badge>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-left text-sm text-zinc-400">
                              다음 열차 정보가 없습니다.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-9" />

              {/* =================================================
    TRANSFERS
================================================= */}

              <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <TrainFront
                        className="h-5 w-5"
                        style={{
                          color: GINZA_COLOR,
                        }}
                      />

                      <h3 className="text-xl font-black tracking-tight text-zinc-950">
                        환승 노선
                      </h3>

                      <span
                        lang="ja"
                        className="hidden text-sm text-zinc-400 sm:inline"
                      >
                        この駅で乗り換え
                      </span>
                    </div>

                    <p
                      lang="ja"
                      className="mt-1.5 pl-8 text-xs text-zinc-400 sm:hidden"
                    >
                      この駅で乗り換え
                    </p>
                  </div>

                  <Badge
                    variant="secondary"
                    className="shrink-0 rounded-full px-3"
                  >
                    {data.connectingRailways.length} routes
                  </Badge>
                </div>

                {data.connectingRailways.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {data.connectingRailways.map((item) => {
                      const railway = item.railway;

                      if (!railway) {
                        return null;
                      }

                      const connectingStation = getConnectingStation(
                        railway,
                        data.connectingStations,
                      );

                      return (
                        <RailwayCard
                          key={item.id}
                          railway={railway}
                          connectingStation={connectingStation}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <Card className="rounded-3xl border-dashed shadow-none">
                    <CardContent className="p-8 text-center">
                      <p className="text-sm font-medium text-zinc-500">
                        환승 가능한 노선이 없습니다.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="mt-10 flex gap-3 rounded-3xl bg-zinc-100/70 p-5">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />

                <p className="text-xs font-medium leading-5 text-zinc-500">
                  Tokyo Metro Open Data를 기반으로 역 및 운행 정보를 표시합니다.
                  실제 운행 상황과 차이가 있을 수 있습니다.
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
