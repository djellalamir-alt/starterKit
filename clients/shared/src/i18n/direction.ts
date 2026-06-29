import { getLanguageMetadata, type Language, type TextDirection } from "./languages";

export function getDirection(language?: unknown): TextDirection {
  return getLanguageMetadata(language).direction;
}

export function isRTL(language?: unknown): boolean {
  return getDirection(language) === "rtl";
}

export function applyDocumentLanguage(language: Language): void {
  if (typeof document === "undefined") return;
  const metadata = getLanguageMetadata(language);
  document.documentElement.lang = metadata.code;
  document.documentElement.dir = metadata.direction;
}
