export type MarunouchiStation = {
  id: string;
  code: string;
  nameJa: string;
  nameKo: string;
  nameEn: string;
  branch?: boolean;
};

export const MARUNOUCHI_COLOR = "#F62E36";

export const MARUNOUCHI_MAIN_STATIONS: MarunouchiStation[] = [
  {
    id: "Ogikubo",
    code: "M01",
    nameJa: "荻窪",
    nameKo: "오기쿠보",
    nameEn: "Ogikubo",
  },
  {
    id: "MinamiAsagaya",
    code: "M02",
    nameJa: "南阿佐ケ谷",
    nameKo: "미나미아사가야",
    nameEn: "Minami-asagaya",
  },
  {
    id: "ShinKoenji",
    code: "M03",
    nameJa: "新高円寺",
    nameKo: "신코엔지",
    nameEn: "Shin-koenji",
  },
  {
    id: "HigashiKoenji",
    code: "M04",
    nameJa: "東高円寺",
    nameKo: "히가시코엔지",
    nameEn: "Higashi-koenji",
  },
  {
    id: "ShinNakano",
    code: "M05",
    nameJa: "新中野",
    nameKo: "신나카노",
    nameEn: "Shin-nakano",
  },
  {
    id: "NakanoSakaue",
    code: "M06",
    nameJa: "中野坂上",
    nameKo: "나카노사카우에",
    nameEn: "Nakano-sakaue",
  },
  {
    id: "NishiShinjuku",
    code: "M07",
    nameJa: "西新宿",
    nameKo: "니시신주쿠",
    nameEn: "Nishi-shinjuku",
  },
  {
    id: "Shinjuku",
    code: "M08",
    nameJa: "新宿",
    nameKo: "신주쿠",
    nameEn: "Shinjuku",
  },
  {
    id: "ShinjukuSanchome",
    code: "M09",
    nameJa: "新宿三丁目",
    nameKo: "신주쿠산초메",
    nameEn: "Shinjuku-sanchome",
  },
  {
    id: "ShinjukuGyoemmae",
    code: "M10",
    nameJa: "新宿御苑前",
    nameKo: "신주쿠교엔마에",
    nameEn: "Shinjuku-gyoemmae",
  },
  {
    id: "YotsuyaSanchome",
    code: "M11",
    nameJa: "四谷三丁目",
    nameKo: "요쓰야산초메",
    nameEn: "Yotsuya-sanchome",
  },
  {
    id: "Yotsuya",
    code: "M12",
    nameJa: "四ツ谷",
    nameKo: "요쓰야",
    nameEn: "Yotsuya",
  },
  {
    id: "AkasakaMitsuke",
    code: "M13",
    nameJa: "赤坂見附",
    nameKo: "아카사카미쓰케",
    nameEn: "Akasaka-mitsuke",
  },
  {
    id: "KokkaiGijidomae",
    code: "M14",
    nameJa: "国会議事堂前",
    nameKo: "국회의사당앞",
    nameEn: "Kokkai-gijidomae",
  },
  {
    id: "Kasumigaseki",
    code: "M15",
    nameJa: "霞ケ関",
    nameKo: "가스미가세키",
    nameEn: "Kasumigaseki",
  },
  { id: "Ginza", code: "M16", nameJa: "銀座", nameKo: "긴자", nameEn: "Ginza" },
  { id: "Tokyo", code: "M17", nameJa: "東京", nameKo: "도쿄", nameEn: "Tokyo" },
  {
    id: "Otemachi",
    code: "M18",
    nameJa: "大手町",
    nameKo: "오테마치",
    nameEn: "Otemachi",
  },
  {
    id: "Awajicho",
    code: "M19",
    nameJa: "淡路町",
    nameKo: "아와지초",
    nameEn: "Awajicho",
  },
  {
    id: "Ochanomizu",
    code: "M20",
    nameJa: "御茶ノ水",
    nameKo: "오차노미즈",
    nameEn: "Ochanomizu",
  },
  {
    id: "HongoSanchome",
    code: "M21",
    nameJa: "本郷三丁目",
    nameKo: "혼고산초메",
    nameEn: "Hongo-sanchome",
  },
  {
    id: "Korakuen",
    code: "M22",
    nameJa: "後楽園",
    nameKo: "고라쿠엔",
    nameEn: "Korakuen",
  },
  {
    id: "Myogadani",
    code: "M23",
    nameJa: "茗荷谷",
    nameKo: "묘가다니",
    nameEn: "Myogadani",
  },
  {
    id: "ShinOtsuka",
    code: "M24",
    nameJa: "新大塚",
    nameKo: "신오쓰카",
    nameEn: "Shin-otsuka",
  },
  {
    id: "Ikebukuro",
    code: "M25",
    nameJa: "池袋",
    nameKo: "이케부쿠로",
    nameEn: "Ikebukuro",
  },
];

export const MARUNOUCHI_BRANCH_STATIONS: MarunouchiStation[] = [
  {
    id: "Honancho",
    code: "Mb03",
    nameJa: "方南町",
    nameKo: "호난초",
    nameEn: "Honancho",
    branch: true,
  },
  {
    id: "NakanoFujimicho",
    code: "Mb04",
    nameJa: "中野富士見町",
    nameKo: "나카노후지미초",
    nameEn: "Nakano-fujimicho",
    branch: true,
  },
  {
    id: "NakanoShimbashi",
    code: "Mb05",
    nameJa: "中野新橋",
    nameKo: "나카노신바시",
    nameEn: "Nakano-shimbashi",
    branch: true,
  },
];

export const MARUNOUCHI_STATIONS: MarunouchiStation[] = [
  ...MARUNOUCHI_MAIN_STATIONS,
  ...MARUNOUCHI_BRANCH_STATIONS,
];
