export type NambokuStation = {
  id: string;
  code: string;
  nameJa: string;
  nameKo: string;
  nameEn: string;
};

export const NAMBOKU_COLOR = "#00AC9B";

export const NAMBOKU_STATIONS: NambokuStation[] = [
  {
    id: "Meguro",
    code: "N01",
    nameJa: "目黒",
    nameKo: "메구로",
    nameEn: "Meguro",
  },
  {
    id: "Shirokanedai",
    code: "N02",
    nameJa: "白金台",
    nameKo: "시로카네다이",
    nameEn: "Shirokanedai",
  },
  {
    id: "ShirokaneTakanawa",
    code: "N03",
    nameJa: "白金高輪",
    nameKo: "시로카네타카나와",
    nameEn: "Shirokane-takanawa",
  },
  {
    id: "AzabuJuban",
    code: "N04",
    nameJa: "麻布十番",
    nameKo: "아자부주반",
    nameEn: "Azabu-juban",
  },
  {
    id: "RoppongiItchome",
    code: "N05",
    nameJa: "六本木一丁目",
    nameKo: "롯폰기잇초메",
    nameEn: "Roppongi-itchome",
  },
  {
    id: "TameikeSanno",
    code: "N06",
    nameJa: "溜池山王",
    nameKo: "다메이케산노",
    nameEn: "Tameike-sanno",
  },
  {
    id: "Nagatacho",
    code: "N07",
    nameJa: "永田町",
    nameKo: "나가타초",
    nameEn: "Nagatacho",
  },
  {
    id: "Yotsuya",
    code: "N08",
    nameJa: "四ツ谷",
    nameKo: "요쓰야",
    nameEn: "Yotsuya",
  },
  {
    id: "Ichigaya",
    code: "N09",
    nameJa: "市ケ谷",
    nameKo: "이치가야",
    nameEn: "Ichigaya",
  },
  {
    id: "Iidabashi",
    code: "N10",
    nameJa: "飯田橋",
    nameKo: "이다바시",
    nameEn: "Iidabashi",
  },
  {
    id: "Korakuen",
    code: "N11",
    nameJa: "後楽園",
    nameKo: "고라쿠엔",
    nameEn: "Korakuen",
  },
  {
    id: "Todaimae",
    code: "N12",
    nameJa: "東大前",
    nameKo: "도다이마에",
    nameEn: "Todaimae",
  },
  {
    id: "HonKomagome",
    code: "N13",
    nameJa: "本駒込",
    nameKo: "혼코마고메",
    nameEn: "Hon-komagome",
  },
  {
    id: "Komagome",
    code: "N14",
    nameJa: "駒込",
    nameKo: "고마고메",
    nameEn: "Komagome",
  },
  {
    id: "Nishigahara",
    code: "N15",
    nameJa: "西ケ原",
    nameKo: "니시가하라",
    nameEn: "Nishigahara",
  },
  { id: "Oji", code: "N16", nameJa: "王子", nameKo: "오지", nameEn: "Oji" },
  {
    id: "OjiKamiya",
    code: "N17",
    nameJa: "王子神谷",
    nameKo: "오지카미야",
    nameEn: "Oji-kamiya",
  },
  { id: "Shimo", code: "N18", nameJa: "志茂", nameKo: "시모", nameEn: "Shimo" },
  {
    id: "AkabaneIwabuchi",
    code: "N19",
    nameJa: "赤羽岩淵",
    nameKo: "아카바네이와부치",
    nameEn: "Akabane-iwabuchi",
  },
];
