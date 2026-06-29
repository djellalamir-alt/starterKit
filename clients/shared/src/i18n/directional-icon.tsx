import type { ComponentType } from "react";
import { useDirection } from "./provider";

type IconProps = { className?: string; "aria-hidden"?: boolean };

export function DirectionalIcon({
  icon: Icon,
  rtlIcon: RtlIcon,
  className,
  decorative = true,
}: {
  icon: ComponentType<IconProps>;
  rtlIcon?: ComponentType<IconProps>;
  className?: string;
  decorative?: boolean;
}) {
  const { isRtl } = useDirection();
  const RenderIcon = isRtl && RtlIcon ? RtlIcon : Icon;
  return (
    <RenderIcon
      aria-hidden={decorative}
      className={[className, isRtl && !RtlIcon ? "scale-x-[-1]" : ""].filter(Boolean).join(" ")}
    />
  );
}
