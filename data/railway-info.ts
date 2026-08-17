export type RailwayInfo = {
  code: string;
  ja: string;
  ko: string;
  operator: string;
  color: string;
};

export const RAILWAY_INFO: Record<string, RailwayInfo> = {
  /* =========================================================
     JR EAST
  ========================================================= */

  Yamanote: {
    code: "JY",
    ja: "山手線",
    ko: "야마노테선",
    operator: "JR東日本",
    color: "#9ACD32",
  },

  SaikyoKawagoe: {
    code: "JA",
    ja: "埼京線",
    ko: "사이쿄선",
    operator: "JR東日本",
    color: "#00AC9B",
  },

  ShonanShinjuku: {
    code: "JS",
    ja: "湘南新宿ライン",
    ko: "쇼난신주쿠라인",
    operator: "JR東日本",
    color: "#E60012",
  },

  ChuoRapid: {
    code: "JC",
    ja: "中央線快速",
    ko: "주오선 쾌속",
    operator: "JR東日本",
    color: "#F15A22",
  },

  ChuoSobuLocal: {
    code: "JB",
    ja: "中央・総武線",
    ko: "주오·소부선",
    operator: "JR東日本",
    color: "#FFD400",
  },

  /* =========================================================
     TOKYO METRO
  ========================================================= */

  Ginza: {
    code: "G",
    ja: "東京メトロ銀座線",
    ko: "긴자선",
    operator: "東京メトロ",
    color: "#FF9500",
  },

  Marunouchi: {
    code: "M",
    ja: "東京メトロ丸ノ内線",
    ko: "마루노우치선",
    operator: "東京メトロ",
    color: "#F62E36",
  },

  Hibiya: {
    code: "H",
    ja: "東京メトロ日比谷線",
    ko: "히비야선",
    operator: "東京メトロ",
    color: "#B5B5AC",
  },

  Tozai: {
    code: "T",
    ja: "東京メトロ東西線",
    ko: "도자이선",
    operator: "東京メトロ",
    color: "#009BBF",
  },

  Chiyoda: {
    code: "C",
    ja: "東京メトロ千代田線",
    ko: "지요다선",
    operator: "東京メトロ",
    color: "#00BB85",
  },

  Yurakucho: {
    code: "Y",
    ja: "東京メトロ有楽町線",
    ko: "유라쿠초선",
    operator: "東京メトロ",
    color: "#C1A470",
  },

  Hanzomon: {
    code: "Z",
    ja: "東京メトロ半蔵門線",
    ko: "한조몬선",
    operator: "東京メトロ",
    color: "#8F76D6",
  },

  Namboku: {
    code: "N",
    ja: "東京メトロ南北線",
    ko: "난보쿠선",
    operator: "東京メトロ",
    color: "#00AC9B",
  },

  Fukutoshin: {
    code: "F",
    ja: "東京メトロ副都心線",
    ko: "후쿠토신선",
    operator: "東京メトロ",
    color: "#9C5E31",
  },

  /* =========================================================
     KEIO
  ========================================================= */

  Inokashira: {
    code: "IN",
    ja: "京王井の頭線",
    ko: "게이오 이노카시라선",
    operator: "京王電鉄",
    color: "#00008B",
  },

  Keio: {
    code: "KO",
    ja: "京王線",
    ko: "게이오선",
    operator: "京王電鉄",
    color: "#DD0077",
  },

  KeioNew: {
    code: "KO",
    ja: "京王新線",
    ko: "게이오 신선",
    operator: "京王電鉄",
    color: "#DD0077",
  },

  /* =========================================================
     TOKYU
  ========================================================= */

  DenEnToshi: {
    code: "DT",
    ja: "東急田園都市線",
    ko: "도큐 덴엔토시선",
    operator: "東急電鉄",
    color: "#20A58E",
  },

  Toyoko: {
    code: "TY",
    ja: "東急東横線",
    ko: "도큐 도요코선",
    operator: "東急電鉄",
    color: "#E50046",
  },
};
