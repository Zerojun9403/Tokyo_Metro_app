import { NextRequest, NextResponse } from "next/server";

const ODPT_STATION_URL = "https://api.odpt.org/api/v4/odpt:Station";

type StationTitle = {
  ja?: string;
  en?: string;
  ko?: string;
  "ja-Hrkt"?: string;
};

type OdptStation = {
  "@id": string;
  "owl:sameAs": string;
  "dc:title"?: string;

  "geo:lat"?: number;
  "geo:long"?: number;

  "odpt:stationCode"?: string;
  "odpt:stationTitle"?: StationTitle;

  "odpt:railway": string;
  "odpt:operator": string;

  "odpt:connectingRailway"?: string[];
  "odpt:connectingStation"?: string[];
  "odpt:stationTimetable"?: string[];
};

function removePrefix(value: string | undefined) {
  if (!value) {
    return null;
  }

  return value.split(".").at(-1) ?? value;
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.ODPT_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "ODPT_API_KEY가 설정되지 않았습니다.",
        },
        {
          status: 500,
        },
      );
    }

    const railway = request.nextUrl.searchParams.get("railway");
    const station = request.nextUrl.searchParams.get("station");

    if (!railway || !station) {
      return NextResponse.json(
        {
          error: "railway와 station 값이 필요합니다.",
          example: "/api/station?railway=Ginza&station=Ginza",
        },
        {
          status: 400,
        },
      );
    }

    const stationId = `odpt.Station:TokyoMetro.${railway}.${station}`;

    const params = new URLSearchParams({
      "owl:sameAs": stationId,
      "acl:consumerKey": apiKey,
    });

    const response = await fetch(`${ODPT_STATION_URL}?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "ODPT 역 정보 호출에 실패했습니다.",
          status: response.status,
        },
        {
          status: response.status,
        },
      );
    }

    const data = (await response.json()) as OdptStation[];

    if (data.length === 0) {
      return NextResponse.json(
        {
          error: "역 정보를 찾지 못했습니다.",
          railway,
          station,
          stationId,
        },
        {
          status: 404,
        },
      );
    }

    const result = data[0];

    return NextResponse.json({
      id: result["owl:sameAs"],

      operator: "TokyoMetro",

      railway: removePrefix(result["odpt:railway"]),

      station: {
        code: result["odpt:stationCode"] ?? null,

        ja: result["odpt:stationTitle"]?.ja ?? result["dc:title"] ?? null,

        hiragana: result["odpt:stationTitle"]?.["ja-Hrkt"] ?? null,

        en: result["odpt:stationTitle"]?.en ?? null,

        ko: result["odpt:stationTitle"]?.ko ?? null,
      },

      location: {
        latitude: result["geo:lat"] ?? null,
        longitude: result["geo:long"] ?? null,
      },

      connectingRailways:
        result["odpt:connectingRailway"]?.map((item) => ({
          id: item,
          railway: removePrefix(item),
        })) ?? [],

      connectingStations:
        result["odpt:connectingStation"]?.map((item) => ({
          id: item,
          station: removePrefix(item),
        })) ?? [],

      timetableIds: result["odpt:stationTimetable"] ?? [],
    });
  } catch (error) {
    console.error("Tokyo Metro Station API Error:", error);

    return NextResponse.json(
      {
        error: "역 정보를 처리하는 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
