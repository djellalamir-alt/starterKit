import { useTranslation } from "react-i18next";
import { Moon, Palette, Sun } from "lucide-react";
import { useLanguageSwitcher, type Language } from "@shared/i18n";
import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "@/components/list";
import { cn } from "@/lib/cn";

type Mode = "light" | "dark";

const MODES: {
  value: Mode;
  label: string;
  icon: typeof Sun;
  blurb: string;
}[] = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    blurb: "Paper-white surfaces, magazine-print mood.",
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    blurb: "Console-default. Lower glare for long sessions.",
  },
];

/**
 * AppearanceSettings — theme picker. ThemeProvider carries a binary
 * light/dark today; a future "Follow system" mode would extend the provider
 * to a tri-state. Persistence is handled by the provider; we just call setTheme.
 */
export function AppearanceSettings() {
  const { t } = useTranslation("common");
  const { theme, setTheme } = useTheme();
  const { language, languages, changeLanguage } = useLanguageSwitcher();

  return (
    <div className="space-y-5 fsh-enter">
      <SettingsSection
        title={t("settings.appearance.languageTitle")}
        icon={Palette}
        description={t("settings.appearance.languageDescription")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {languages.map((item) => {
            const active = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => void changeLanguage(item.code as Language)}
                aria-pressed={active}
                className={cn(
                  "group/card relative flex flex-col items-start gap-1.5 overflow-hidden rounded-xl border p-4 text-start",
                  "transition-colors duration-[var(--duration-default)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2",
                  active
                    ? "border-[var(--color-accent-signal)] bg-[oklch(from_var(--color-accent-signal)_l_c_h_/_0.08)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-muted)]",
                )}
              >
                <span className={cn("text-sm font-semibold tracking-tight", active && "text-[var(--color-accent-signal)]")}>{item.nativeLabel}</span>
                <span className="text-xs text-[var(--color-muted-foreground)]">{item.englishLabel}</span>
                {active && (
                  <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent-signal)]">
                    {t("theme.active")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </SettingsSection>

      {/* Theme */}
      <SettingsSection
        title={t("settings.appearance.themeTitle")}
        icon={Palette}
        description={t("settings.appearance.adminThemeDescription")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MODES.map(({ value, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={active}
                className={cn(
                  "group/card relative overflow-hidden flex flex-col items-start gap-2 rounded-xl border p-4 text-start",
                  "transition-colors duration-[var(--duration-default)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2",
                  active
                    ? "border-[var(--color-accent-signal)] bg-[oklch(from_var(--color-accent-signal)_l_c_h_/_0.08)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-muted)]",
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-md",
                      active
                        ? "bg-[oklch(from_var(--color-accent-signal)_l_c_h_/_0.12)] text-[var(--color-accent-signal)]"
                        : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {active && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent-signal)]">
                      Active
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    active && "text-[var(--color-accent-signal)]",
                  )}
                >
                  {t(`theme.${value}`)}
                </span>
                <span className="text-xs leading-relaxed text-[var(--color-muted-foreground)]">
                  {t(`settings.appearance.${value}Blurb`)}
                </span>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      {/* Density — placeholder for a future compact toggle */}
      <SettingsSection
        title={t("settings.appearance.densityTitle")}
        icon={Palette}
        description={t("settings.appearance.adminDensityDescription")}
      >
        <Button variant="outline" size="sm" disabled>
          {t("settings.appearance.compactComingSoon")}
        </Button>
      </SettingsSection>
    </div>
  );
}
