export const Language = {
  En: "en",
  Ar: "ar",
} as const;

export type Language = (typeof Language)[keyof typeof Language];
export type TextDirection = "ltr" | "rtl";

export type LanguageMetadata = {
  code: Language;
  nativeLabel: string;
  englishLabel: string;
  direction: TextDirection;
  intlLocale: string;
};

export const DEFAULT_LANGUAGE = Language.En;
export const LANGUAGE_STORAGE_KEY = "app-language";

export const SUPPORTED_LANGUAGES: readonly LanguageMetadata[] = [
  {
    code: Language.En,
    nativeLabel: "English",
    englishLabel: "English",
    direction: "ltr",
    intlLocale: "en-US",
  },
  {
    code: Language.Ar,
    nativeLabel: "العربية",
    englishLabel: "Arabic",
    direction: "rtl",
    intlLocale: "ar-SA",
  },
] as const;

const supportedLanguageCodes = new Set<string>(SUPPORTED_LANGUAGES.map((language) => language.code));

export function isSupportedLanguage(value: unknown): value is Language {
  return typeof value === "string" && supportedLanguageCodes.has(value);
}

export function normalizeLanguage(value: unknown): Language {
  if (isSupportedLanguage(value)) return value;
  if (typeof value === "string") {
    const baseLanguage = value.split("-")[0];
    if (isSupportedLanguage(baseLanguage)) return baseLanguage;
  }
  return DEFAULT_LANGUAGE;
}

export function getLanguageMetadata(language: unknown): LanguageMetadata {
  const normalized = normalizeLanguage(language);
  return SUPPORTED_LANGUAGES.find((item) => item.code === normalized) ?? SUPPORTED_LANGUAGES[0];
}

export function getCurrentLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function getIntlLocale(language?: unknown): string {
  return getLanguageMetadata(language ?? getCurrentLanguage()).intlLocale;
}
