import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import type { i18n } from "i18next";
import { applyDocumentLanguage, getDirection, isRTL } from "./direction";
import {
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
  type Language,
  type TextDirection,
} from "./languages";

type DirectionContextValue = {
  language: Language;
  direction: TextDirection;
  isRtl: boolean;
  changeLanguage: (language: Language) => Promise<void>;
};

const DirectionContext = createContext<DirectionContextValue | null>(null);

export function LanguageProvider({ children, i18n }: { children: ReactNode; i18n: i18n }) {
  const [language, setLanguage] = useState<Language>(() => normalizeLanguage(i18n.resolvedLanguage ?? i18n.language));

  useEffect(() => {
    const applyLanguage = (nextLanguage: string) => {
      const normalized = normalizeLanguage(nextLanguage);
      setLanguage(normalized);
      applyDocumentLanguage(normalized);
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
      } catch {
        /* localStorage can be unavailable in private/test contexts. */
      }
    };

    applyLanguage(i18n.resolvedLanguage ?? i18n.language);
    i18n.on("languageChanged", applyLanguage);
    return () => i18n.off("languageChanged", applyLanguage);
  }, [i18n]);

  const value = useMemo<DirectionContextValue>(
    () => ({
      language,
      direction: getDirection(language),
      isRtl: isRTL(language),
      changeLanguage: async (nextLanguage: Language) => {
        await i18n.changeLanguage(nextLanguage);
      },
    }),
    [i18n, language],
  );

  return (
    <I18nextProvider i18n={i18n}>
      <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>
    </I18nextProvider>
  );
}

export function useDirection(): DirectionContextValue {
  const context = useContext(DirectionContext);
  if (!context) throw new Error("useDirection must be used within LanguageProvider");
  return context;
}
