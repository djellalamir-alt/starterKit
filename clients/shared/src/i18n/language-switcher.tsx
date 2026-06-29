import { Check, Languages } from "lucide-react";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import { SUPPORTED_LANGUAGES, type Language } from "./languages";
import { useDirection } from "./provider";

export function useLanguageSwitcher() {
  const { t } = useTranslation("common");
  const { language, isRtl, changeLanguage } = useDirection();

  return {
    language,
    isRtl,
    languages: SUPPORTED_LANGUAGES,
    label: t("language.switcherLabel"),
    changeLanguage: (nextLanguage: Language) => changeLanguage(nextLanguage),
  };
}

export function LanguageSwitcher({
  align,
  className,
  triggerVariant = "ghost",
}: {
  align?: "start" | "center" | "end";
  className?: string;
  triggerVariant?: ComponentProps<typeof Button>["variant"];
}) {
  const { language, languages, label, isRtl, changeLanguage } = useLanguageSwitcher();
  const menuAlign = align ?? (isRtl ? "start" : "end");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          size="icon-sm"
          aria-label={label}
          title={label}
          className={className}
        >
          <Languages className="h-4 w-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={menuAlign} sideOffset={6} className="w-[180px]">
        {languages.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onSelect={() => void changeLanguage(item.code as Language)}
            className="!my-0 flex cursor-pointer items-center gap-2.5 rounded-md !px-2.5 !py-1.5"
          >
            <span className="flex-1 text-[12.5px] font-medium text-[var(--color-foreground)]">
              {item.nativeLabel}
            </span>
            <Check
              aria-hidden
              className={cn(
                "size-3.5 shrink-0 text-[var(--color-primary)]",
                language === item.code ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
