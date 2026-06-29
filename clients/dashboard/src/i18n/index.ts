import type { i18n as I18n, Resource } from "i18next";
import {
  BASE_NAMESPACES,
  applyDocumentLanguage,
  getCurrentLanguage,
  initializeI18n,
} from "@shared/i18n";
import commonEn from "@shared/i18n/resources/en/common.json";
import authEn from "@shared/i18n/resources/en/auth.json";
import navigationEn from "@shared/i18n/resources/en/navigation.json";
import validationEn from "@shared/i18n/resources/en/validation.json";
import errorsEn from "@shared/i18n/resources/en/errors.json";
import commonAr from "@shared/i18n/resources/ar/common.json";
import authAr from "@shared/i18n/resources/ar/auth.json";
import navigationAr from "@shared/i18n/resources/ar/navigation.json";
import validationAr from "@shared/i18n/resources/ar/validation.json";
import errorsAr from "@shared/i18n/resources/ar/errors.json";
import dashboardEn from "./resources/en/dashboard.json";
import dashboardAr from "./resources/ar/dashboard.json";
import commandEn from "./resources/en/command.json";
import commandAr from "./resources/ar/command.json";

const resources: Resource = {
  en: {
    common: commonEn,
    auth: authEn,
    navigation: navigationEn,
    validation: validationEn,
    errors: errorsEn,
    dashboard: dashboardEn,
    command: commandEn,
  },
  ar: {
    common: commonAr,
    auth: authAr,
    navigation: navigationAr,
    validation: validationAr,
    errors: errorsAr,
    dashboard: dashboardAr,
    command: commandAr,
  },
};

let appI18n: I18n | null = null;

export async function initI18n(): Promise<I18n> {
  if (appI18n) return appI18n;
  applyDocumentLanguage(getCurrentLanguage());
  const instance = await initializeI18n(resources, [...BASE_NAMESPACES, "dashboard", "command"]);
  appI18n = instance;
  return instance;
}

export function getI18n(): I18n {
  if (!appI18n) throw new Error("i18n has not been initialized");
  return appI18n;
}
