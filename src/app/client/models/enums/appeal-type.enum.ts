// enums/appeal-type.enum.ts
export enum AppealTypeEnum {
  AGGRAVATION_INSTRUMENT = "AGGRAVATION_INSTRUMENT",
  EMBARGO = "EMBARGO",
  REVISION = "REVISION",
  TERMINATION_ACTION = "TERMINATION_ACTION",
  EXTRAORDINARY = "EXTRAORDINARY",
  ORDINARY = "ORDINARY",
}

const APPEAL_LABEL: Record<AppealTypeEnum, string> = {
  [AppealTypeEnum.AGGRAVATION_INSTRUMENT]: "Agravo de Instrumento",
  [AppealTypeEnum.EMBARGO]: "Embargos de Declaração",
  [AppealTypeEnum.REVISION]: "Recurso de Revista",
  [AppealTypeEnum.TERMINATION_ACTION]: "Recurso ação rescisória",
  [AppealTypeEnum.EXTRAORDINARY]: "Recurso Extraordinário",
  [AppealTypeEnum.ORDINARY]: "Recurso Ordinário",
} as const;

const norm = (v: unknown) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, "_");

// Synonimous may apper adding manualy
const SYNONYMS: Record<string, AppealTypeEnum> = {
  // ordinário
  ordinario: AppealTypeEnum.ORDINARY,
  recurso_ordinario: AppealTypeEnum.ORDINARY,

  // extraordinário
  extraordinario: AppealTypeEnum.EXTRAORDINARY,
  recurso_extraordinario: AppealTypeEnum.EXTRAORDINARY,

  // revista
  revista: AppealTypeEnum.REVISION,
  recurso_de_revista: AppealTypeEnum.REVISION,

  // agravo
  agravo: AppealTypeEnum.AGGRAVATION_INSTRUMENT,
  agravo_de_instrumento: AppealTypeEnum.AGGRAVATION_INSTRUMENT,

  // embargos
  embargos: AppealTypeEnum.EMBARGO,
  embargos_de_declaracao: AppealTypeEnum.EMBARGO,

  // ação rescisória
  acao_rescisoria: AppealTypeEnum.TERMINATION_ACTION,
  recurso_acao_rescisoria: AppealTypeEnum.TERMINATION_ACTION,
} as const;

export const AppealType = {
  toList(): { key: AppealTypeEnum; text: string }[] {
    return (Object.keys(APPEAL_LABEL) as Array<keyof typeof APPEAL_LABEL>).map((k) => ({
      key: k,
      text: APPEAL_LABEL[k],
    }));
  },

  getTextFromKey(key: AppealTypeEnum | string | null | undefined): string {
    if (!key) return "—";
    return APPEAL_LABEL[key as AppealTypeEnum] ?? "—";
  },

  getTextFromAny(raw: unknown): string {
    if (raw && APPEAL_LABEL[raw as AppealTypeEnum]) {
      return APPEAL_LABEL[raw as AppealTypeEnum];
    }
    const mapped = SYNONYMS[norm(raw)];
    if (mapped) return APPEAL_LABEL[mapped];

    const s = String(raw ?? "").trim();
    return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "—";
  },
} as const;
