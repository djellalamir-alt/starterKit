import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import i18next, { type InitOptions, type Resource } from "i18next";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, normalizeLanguage } from "./languages";
import { applyDocumentLanguage } from "./direction";

export const BASE_NAMESPACES = ["common", "auth", "navigation", "validation", "errors"] as const;
export type BaseNamespace = (typeof BASE_NAMESPACES)[number];

export const detectionOptions = {
  order: ["localStorage", "navigator", "htmlTag"],
  caches: ["localStorage"],
  lookupLocalStorage: LANGUAGE_STORAGE_KEY,
};

export function createI18nOptions(resources: Resource, namespaces: readonly string[] = BASE_NAMESPACES): InitOptions {
  return {
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((language) => language.code),
    ns: namespaces,
    defaultNS: "common",
    fallbackNS: "common",
    detection: detectionOptions,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  };
}

export async function initializeI18n(resources: Resource, namespaces: readonly string[] = BASE_NAMESPACES) {
  const instance = i18next.createInstance();
  instance.use(LanguageDetector).use(initReactI18next);
  await instance.init(createI18nOptions(resources, namespaces));
  applyDocumentLanguage(normalizeLanguage(instance.resolvedLanguage ?? instance.language));
  return instance;
}
