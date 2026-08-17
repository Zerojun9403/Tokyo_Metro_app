import { NextRequest, NextResponse } from "next/server";

/* =========================================================
   ODPT Types
========================================================= */

type OdptStationTimetableObject = {
  "odpt:departureTime"?: string;
  "odpt:arrivalTime"?: string;
  "odpt:destinationStation"?: string[];
  "odpt:trainType"?: string;
  "odpt:trainNumber"?: string;
  "odpt:train"?: string;
};

type OdptStationTimetable = {
  "@id": string;
  "@type": string;
  "owl:sameAs": string;

  "odpt:railway": string;
  "odpt:station": string;
  "odpt:calendar": string;
  "odpt:operator": string;
  "odpt:railDirection": string;

  "odpt:stationTimetableObject": OdptStationTimetableObject[];
};

/* =========================================================
   Helpers
========================================================= */

/**
 * ODPT ID에서 마지막 이름만 가져온다.
 *
 * 예:
 * odpt.Calendar:Weekday
 * → Weekday
 *
 * odpt.RailDirection:TokyoMetro.Asakusa
 * → Asakusa
 *
 * odpt.Station:TokyoMetro.Ginza.Ginza
 * → Ginza
 */
const getShortName = (value?: string) => {
  if (!value) {
    return null;
  }

  const afterColon = value.split(":").at(-1) ?? value;

  const parts = afterColon.split(".");

  return parts.at(-1) ?? afterColon;
};

/**
 * 09:45 → 분 단위 숫자로 변환
 *
 * 9 * 60 + 45 = 585
 */
const getMinutesFromTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
};

/**
 * 현재 도쿄 시간
 */
const getTokyoNow = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");

  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? "0",
  );

  return {
    hour,
    minute,

    totalMinutes: hour * 60 + minute,
  };
};

/**
 * 오늘 사용할 시간표 종류
 *
 * 월 ~ 금
 * → Weekday
 *
 * 토 / 일
 * → SaturdayHoliday
 *
 * 일본 공휴일 판정은 나중에 추가
 */
const getTokyoCalendar = () => {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
  }).format(new Date());

  if (weekday === "Sat" || weekday === "Sun") {
    return "SaturdayHoliday";
  }

  return "Weekday";
};

/* =========================================================
   GET
========================================================= */

export async function GET(request: NextRequest) {
  try {
    /* =====================================================
       API KEY
    ===================================================== */

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

    /* =====================================================
       Query Parameters
    ===================================================== */

    const searchParams = request.nextUrl.searchParams;

    const railway = searchParams.get("railway");
    const station = searchParams.get("station");

    if (!railway || !station) {
      return NextResponse.json(
        {
          error: "railway와 station이 필요합니다.",

          example: "/api/station-timetable?railway=Ginza&station=Ginza",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       ODPT Station ID
    ===================================================== */

    const stationId = `odpt.Station:TokyoMetro.${railway}.${station}`;

    /* =====================================================
       ODPT API URL
    ===================================================== */

    const url = new URL("https://api.odpt.org/api/v4/odpt:StationTimetable");

    url.searchParams.set("odpt:operator", "odpt.Operator:TokyoMetro");

    url.searchParams.set("odpt:railway", `odpt.Railway:TokyoMetro.${railway}`);

    url.searchParams.set("odpt:station", stationId);

    url.searchParams.set("acl:consumerKey", apiKey);

    /* =====================================================
       Fetch
    ===================================================== */

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();

      return NextResponse.json(
        {
          error: "ODPT 시간표 API 요청에 실패했습니다.",

          status: response.status,

          detail: text,
        },
        {
          status: response.status,
        },
      );
    }

    const data = (await response.json()) as OdptStationTimetable[];

    /* =====================================================
       Tokyo Time / Calendar
    ===================================================== */

    const calendar = getTokyoCalendar();

    const now = getTokyoNow();

    /* =====================================================
       오늘 시간표만 선택
    ===================================================== */

    const todayTimetables = data.filter((item) => {
      const timetableCalendar = getShortName(item["odpt:calendar"]);

      return timetableCalendar === calendar;
    });

    /* =====================================================
       방향별 다음 열차
    ===================================================== */

    const directions = todayTimetables.map((timetable) => {
      const timetableObjects = timetable["odpt:stationTimetableObject"] ?? [];

      const upcoming = timetableObjects
        /*
         * 현재 시간 이후 열차만 남김
         */
        .filter((item) => {
          const departureTime = item["odpt:departureTime"];

          if (!departureTime) {
            return false;
          }

          const departureMinutes = getMinutesFromTime(departureTime);

          return departureMinutes >= now.totalMinutes;
        })

        /*
         * 다음 3개 열차
         */
        .slice(0, 3)

        /*
         * 프론트에서 사용하기 좋은 구조로 변환
         */
        .map((item) => {
          const departureTime = item["odpt:departureTime"] ?? null;

          const departureMinutes = departureTime
            ? getMinutesFromTime(departureTime)
            : null;

          const minutesUntilDeparture =
            departureMinutes !== null
              ? departureMinutes - now.totalMinutes
              : null;

          return {
            departureTime,

            minutesUntilDeparture,

            trainNumber: item["odpt:trainNumber"] ?? null,

            trainType: getShortName(item["odpt:trainType"]),

            destinationStations:
              item["odpt:destinationStation"]?.map((destination) =>
                getShortName(destination),
              ) ?? [],

            train: getShortName(item["odpt:train"]),
          };
        });

      return {
        direction: getShortName(timetable["odpt:railDirection"]),

        railway: getShortName(timetable["odpt:railway"]),

        station: getShortName(timetable["odpt:station"]),

        calendar: getShortName(timetable["odpt:calendar"]),

        timetableCount: timetableObjects.length,

        upcoming,
      };
    });

    /* =====================================================
       Response
    ===================================================== */

    return NextResponse.json({
      railway,

      station,

      currentTime: {
        timezone: "Asia/Tokyo",

        hour: now.hour,

        minute: now.minute,
      },

      calendar,

      totalTimetableCount: data.length,

      todayTimetableCount: todayTimetables.length,

      directionCount: directions.length,

      directions,
    });
  } catch (error) {
    console.error("Station timetable API error:", error);

    return NextResponse.json(
      {
        error: "시간표 데이터를 처리하는 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
