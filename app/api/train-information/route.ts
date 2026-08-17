import { NextRequest, NextResponse } from "next/server";

const ODPT_TRAIN_INFORMATION_URL =
  "https://api.odpt.org/api/v4/odpt:TrainInformation";

type MultilingualText = {
  ja?: string;
  en?: string;
  ko?: string;
};

type OdptTrainInformation = {
  "@id": string;
  "dc:date"?: string;
  "dct:valid"?: string;
  "owl:sameAs": string;
  "odpt:railway": string;
  "odpt:operator": string;

  "odpt:trainInformationText"?: MultilingualText;
  "odpt:trainInformationStatus"?: MultilingualText;
  "odpt:trainInformationCause"?: MultilingualText;
};

function getJapaneseText(value?: MultilingualText) {
  return value?.ja ?? null;
}

function isNormalOperation(text: string | null) {
  if (!text) {
    return false;
  }

  return text.includes("平常どおり運転");
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

    if (!railway) {
      return NextResponse.json(
        {
          error: "railway 값이 필요합니다.",
          example: "/api/train-information?railway=Ginza",
        },
        {
          status: 400,
        },
      );
    }

    const railwayId = `odpt.Railway:TokyoMetro.${railway}`;

    const params = new URLSearchParams({
      "odpt:operator": "odpt.Operator:TokyoMetro",
      "odpt:railway": railwayId,
      "acl:consumerKey": apiKey,
    });

    const response = await fetch(
      `${ODPT_TRAIN_INFORMATION_URL}?${params.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Tokyo Metro 운행정보 호출에 실패했습니다.",
          status: response.status,
        },
        {
          status: response.status,
        },
      );
    }

    const data = (await response.json()) as OdptTrainInformation[];

    const information = data.find((item) => item["odpt:railway"] === railwayId);

    if (!information) {
      return NextResponse.json(
        {
          error: "해당 노선의 운행정보를 찾지 못했습니다.",
          railway,
          count: data.length,
        },
        {
          status: 404,
        },
      );
    }

    const text = getJapaneseText(information["odpt:trainInformationText"]);

    const status = getJapaneseText(information["odpt:trainInformationStatus"]);

    const cause = getJapaneseText(information["odpt:trainInformationCause"]);

    const normal = isNormalOperation(text);

    return NextResponse.json({
      railway,

      normal,

      status: status ?? (normal ? "平常運転" : null),

      text,

      cause,

      updatedAt: information["dc:date"] ?? null,

      validUntil: information["dct:valid"] ?? null,
    });
  } catch (error) {
    console.error("Tokyo Metro TrainInformation API Error:", error);

    return NextResponse.json(
      {
        error: "운행정보를 처리하는 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
