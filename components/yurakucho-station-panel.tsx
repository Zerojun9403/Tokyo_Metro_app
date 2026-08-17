"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  RefreshCw,
  TrainFront,
} from "lucide-react";

import { RailwayCard } from "@/components/railway-card";
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
import { YURAKUCHO_COLOR, type YurakuchoStation } from "@/data/yurakucho";

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
  currentTime: {
    timezone: string;
    hour: number;
    minute: number;
  };
  calendar: string;
  totalTimetableCount: number;
  todayTimetableCount: number;
  directionCount: number;
  directions: TimetableDirection[];
};

type YurakuchoStationPanelProps = {
  station: YurakuchoStation;
  onClose: () => void;
};

const DIRECTION_INFO: Record<
  string,
  { ja: string; ko: string; code: string; side: "left" | "right" }
> = {
  Wakoshi: {
    ja: "和光市方面",
    ko: "와코시 방면",
    code: "Y01",
    side: "left",
  },
  ShinKiba: {
    ja: "新木場方面",
    ko: "신키바 방면",
    code: "Y24",
    side: "right",
  },
};

const STATION_NAMES: Record<string, { ja: string; ko: string }> = {
  Wakoshi: { ja: "和光市", ko: "와코시" },
  ChikatetsuNarimasu: { ja: "地下鉄成増", ko: "지카테쓰나리마스" },
  ChikatetsuAkatsuka: { ja: "地下鉄赤塚", ko: "지카테쓰아카쓰카" },
  Heiwadai: { ja: "平和台", ko: "헤이와다이" },
  Hikawadai: { ja: "氷川台", ko: "히카와다이" },
  KotakeMukaihara: { ja: "小竹向原", ko: "고타케무카이하라" },
  Senkawa: { ja: "千川", ko: "센카와" },
  Kanamecho: { ja: "要町", ko: "가나메초" },
  Ikebukuro: { ja: "池袋", ko: "이케부쿠로" },
  HigashiIkebukuro: { ja: "東池袋", ko: "히가시이케부쿠로" },
  Gokokuji: { ja: "護国寺", ko: "고코쿠지" },
  Edogawabashi: { ja: "江戸川橋", ko: "에도가와바시" },
  Iidabashi: { ja: "飯田橋", ko: "이다바시" },
  Ichigaya: { ja: "市ケ谷", ko: "이치가야" },
  Kojimachi: { ja: "麹町", ko: "고지마치" },
  Nagatacho: { ja: "永田町", ko: "나가타초" },
  Sakuradamon: { ja: "桜田門", ko: "사쿠라다몬" },
  Yurakucho: { ja: "有楽町", ko: "유라쿠초" },
  GinzaItchome: { ja: "銀座一丁目", ko: "긴자잇초메" },
  Shintomicho: { ja: "新富町", ko: "신토미초" },
  Tsukishima: { ja: "月島", ko: "쓰키시마" },
  Toyosu: { ja: "豊洲", ko: "도요스" },
  Tatsumi: { ja: "辰巳", ko: "다쓰미" },
  ShinKiba: { ja: "新木場", ko: "신키바" },

  // Common through-service destinations
  Kawagoeshi: { ja: "川越市", ko: "가와고에시" },
  ShinrinKoen: { ja: "森林公園", ko: "신린코엔" },
  Kotesashi: { ja: "小手指", ko: "고테사시" },
  Hanno: { ja: "飯能", ko: "한노" },
};

function getConnectingStation(
  railway: string | null,
  stations: ConnectingStation[],
) {
  if (!railway) return null;

  const match = stations.find((item) => item.id.includes(`.${railway}.`));

  return match?.station ?? null;
}

function formatTokyoTime(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getDestinationName(value: string | null) {
  if (!value) return "—";

  return STATION_NAMES[value]?.ja ?? value;
}

function getRailwayForStation(_station: YurakuchoStation) {
  return "Yurakucho";
}

export function YurakuchoStationPanel({
  station,
  onClose,
}: YurakuchoStationPanelProps) {
  const [data, setData] = useState<StationApiResponse | null>(null);
  const [trainInformation, setTrainInformation] =
    useState<TrainInformation | null>(null);
  const [timetable, setTimetable] = useState<StationTimetableResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        setData(null);
        setTrainInformation(null);
        setTimetable(null);

        const railway = getRailwayForStation(station);

        const params = new URLSearchParams({
          railway,
          station: station.id,
        });

        const [stationResponse, trainInformationResponse, timetableResponse] =
          await Promise.all([
            fetch(`/api/station?${params.toString()}`, {
              cache: "no-store",
              signal: controller.signal,
            }),
            fetch(`/api/train-information?railway=${railway}`, {
              cache: "no-store",
              signal: controller.signal,
            }),
            fetch(`/api/station-timetable?${params.toString()}`, {
              cache: "no-store",
              signal: controller.signal,
            }),
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
          setTrainInformation(
            (await trainInformationResponse.json()) as TrainInformation,
          );
        }

        if (timetableResponse.ok) {
          setTimetable(
            (await timetableResponse.json()) as StationTimetableResponse,
          );
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

    return () => controller.abort();
  }, [station]);

  const updatedTime = formatTokyoTime(trainInformation?.updatedAt ?? null);
  const stationCode = data?.station.code ?? station.code;

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-zinc-200 bg-[#fcfcfc] p-0 sm:!w-[50vw] sm:!max-w-[900px]"
      >
        <div
          className="sticky top-0 z-20 h-1.5 w-full"
          style={{ backgroundColor: YURAKUCHO_COLOR }}
        />

        <div className="px-5 pb-12 pt-7 sm:px-8 lg:px-10">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-5 sm:gap-6">
              <div
                className="flex h-[76px] w-[76px] shrink-0 flex-col items-center justify-center rounded-full border-[6px] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.06)] sm:h-[88px] sm:w-[88px]"
                style={{ borderColor: YURAKUCHO_COLOR }}
              >
                <span className="text-xs font-black leading-none text-zinc-900">
                  {"Y"}
                </span>
                <span className="mt-1 text-2xl font-black leading-none text-zinc-950">
                  {stationCode.replace("Y", "")}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <SheetTitle
                    lang="ja"
                    className="text-3xl font-black tracking-[-0.04em] text-zinc-950 sm:text-4xl"
                  >
                    {data?.station.ja ?? station.nameJa}
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
                  <span lang="en">{data?.station.en ?? station.nameEn}</span>
                  <span className="mx-2 text-zinc-300">/</span>
                  <span lang="ko">{data?.station.ko ?? station.nameKo}</span>
                </SheetDescription>

                <div className="mt-4">
                  <Badge
                    variant="secondary"
                    className="gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-bold text-zinc-700 hover:bg-zinc-50"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: YURAKUCHO_COLOR }}
                    />
                    "東京メトロ有楽町線"
                  </Badge>
                </div>
              </div>
            </div>
          </SheetHeader>

          <Separator className="my-8" />

          {loading && (
            <div className="space-y-5">
              <Skeleton className="h-32 w-full rounded-3xl" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-56 rounded-3xl" />
                <Skeleton className="h-56 rounded-3xl" />
              </div>
              <Skeleton className="h-24 rounded-3xl" />
            </div>
          )}

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
              {trainInformation && (
                <section>
                  <div
                    className={`rounded-3xl border p-5 sm:p-6 ${
                      trainInformation.normal
                        ? "border-emerald-200 bg-emerald-50/70"
                        : "border-amber-200 bg-amber-50/80"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-2 h-3 w-3 shrink-0 rounded-full ${
                            trainInformation.normal
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              lang="ja"
                              className={`text-xl font-black ${
                                trainInformation.normal
                                  ? "text-emerald-800"
                                  : "text-amber-800"
                              }`}
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
                            className={`mt-1 text-sm font-semibold ${
                              trainInformation.normal
                                ? "text-emerald-700"
                                : "text-amber-700"
                            }`}
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
                  </div>
                </section>
              )}

              <section className="mt-9">
                <div className="mb-4 flex items-baseline gap-3">
                  <h3 className="text-xl font-black tracking-tight text-zinc-950">
                    운행 방향
                  </h3>
                  <span className="text-sm font-medium text-zinc-400">
                    Direction
                  </span>
                </div>

                {timetable && timetable.directions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[...timetable.directions]
                      .sort((a, b) => {
                        const order: Record<string, number> = {
                          Wakoshi: 0,
                          ShinKiba: 1,
                        };

                        return (
                          (order[a.direction ?? ""] ?? 99) -
                          (order[b.direction ?? ""] ?? 99)
                        );
                      })
                      .map((direction, index) => {
                        const directionKey = direction.direction ?? "";
                        const info = DIRECTION_INFO[directionKey];
                        const right = info?.side === "right";

                        return (
                          <Card
                            key={`${directionKey}-${index}`}
                            className="overflow-hidden rounded-[28px] border-zinc-200 bg-white shadow-[0_3px_14px_rgba(0,0,0,0.04)]"
                          >
                            <CardContent className="p-6">
                              <div
                                className={right ? "text-right" : "text-left"}
                              >
                                <div
                                  className={`flex items-center gap-3 ${
                                    right ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  {!right && (
                                    <ArrowLeft className="h-5 w-5 text-zinc-500" />
                                  )}

                                  <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor: YURAKUCHO_COLOR,
                                    }}
                                  />

                                  <span
                                    className="text-sm font-black"
                                    style={{ color: YURAKUCHO_COLOR }}
                                  >
                                    {info?.code ?? "Y"}
                                  </span>

                                  {right && (
                                    <ArrowRight className="h-5 w-5 text-zinc-500" />
                                  )}
                                </div>

                                <p
                                  lang="ja"
                                  className="mt-5 text-xl font-black tracking-tight text-zinc-950"
                                >
                                  {info?.ja ?? `${directionKey}方面`}
                                </p>

                                <p
                                  lang="ko"
                                  className="mt-1 text-sm font-medium text-zinc-500"
                                >
                                  {info?.ko ?? `${directionKey} 방면`}
                                </p>
                              </div>

                              <Separator className="my-5" />

                              <div className="mb-3">
                                <span className="text-xs font-bold text-zinc-400">
                                  次の電車 · 다음 열차
                                </span>
                              </div>

                              {direction.upcoming.length > 0 ? (
                                <div className="space-y-2">
                                  {direction.upcoming
                                    .slice(0, 3)
                                    .map((train, trainIndex) => {
                                      const destination =
                                        train.destinationStations[0] ?? null;

                                      return (
                                        <div
                                          key={`${train.trainNumber}-${train.departureTime}-${trainIndex}`}
                                          className="flex min-h-[68px] items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3"
                                        >
                                          <div className="min-w-0">
                                            <p className="text-xl font-black leading-none tabular-nums text-zinc-950">
                                              {train.departureTime ?? "--:--"}
                                            </p>
                                            <p className="mt-2 text-xs font-medium text-zinc-400">
                                              {train.trainNumber ?? ""}
                                            </p>
                                          </div>

                                          <div className="min-w-0 text-right">
                                            <p
                                              className="text-sm font-black"
                                              style={{
                                                color: YURAKUCHO_COLOR,
                                              }}
                                            >
                                              {train.minutesUntilDeparture !==
                                              null
                                                ? `${train.minutesUntilDeparture}분 후`
                                                : "—"}
                                            </p>

                                            <p
                                              lang="ja"
                                              className="mt-1 truncate text-xs font-medium text-zinc-600"
                                            >
                                              {getDestinationName(destination)}
                                              行
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              ) : (
                                <div className="rounded-2xl bg-zinc-50 px-4 py-6 text-center">
                                  <p className="text-xs font-medium text-zinc-400">
                                    현재 시간 이후 열차가 없습니다.
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                ) : (
                  <Card className="rounded-3xl border-dashed shadow-none">
                    <CardContent className="p-7 text-center">
                      <p className="text-sm font-medium text-zinc-500">
                        시간표 정보를 불러오지 못했습니다.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>

              <Separator className="my-9" />

              <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <TrainFront
                        className="h-5 w-5"
                        style={{ color: YURAKUCHO_COLOR }}
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
                      if (!item.railway) return null;

                      return (
                        <RailwayCard
                          key={item.id}
                          railway={item.railway}
                          connectingStation={getConnectingStation(
                            item.railway,
                            data.connectingStations,
                          )}
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

              <div className="mt-10 flex gap-3 rounded-3xl bg-zinc-100/70 p-5">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
                <p className="text-xs font-medium leading-5 text-zinc-500">
                  Tokyo Metro Open Data를 기반으로 역·운행·시간표 정보를
                  표시합니다. 시간표의 ‘몇 분 후’ 표시는 시각표 기준입니다.
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
