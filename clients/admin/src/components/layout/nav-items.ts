import {
  Activity,
  Building2,
  LayoutDashboard,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCog,
  UsersRound,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import {
  AuditingPermissions,
  BillingPermissions,
  IdentityPermissions,
  MultitenancyPermissions,
  WebhooksPermissions,
} from "@/lib/permissions";

/** A single nav destination — route, i18n key, icon, optional perm guard. */
export type NavSpec = {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  /** One or more permissions the user must hold to see this item. */
  perms?: readonly string[];
};

/** A collapsible section that groups related NavSpecs. */
export type NavSection = {
  id: string;
  captionKey: string;
  icon: LucideIcon;
  items: NavSpec[];
};

// ─── Top-level singletons ────────────────────────────────────────────────────

export const topNavTop: NavSpec[] = [
  { to: "/", labelKey: "overview", icon: LayoutDashboard },
];

export const topNavBottom: NavSpec[] = [
  { to: "/settings", labelKey: "settings", icon: Settings },
];

// ─── Section accordions ──────────────────────────────────────────────────────

export const sections: NavSection[] = [
  {
    id: "multitenancy",
    captionKey: "tenants",
    icon: Building2,
    items: [
      {
        to: "/tenants",
        labelKey: "tenants",
        icon: Building2,
        perms: [MultitenancyPermissions.Tenants.View],
      },
    ],
  },
  {
    id: "identity",
    captionKey: "identity",
    icon: UsersRound,
    items: [
      {
        to: "/users",
        labelKey: "users",
        icon: UsersRound,
        perms: [IdentityPermissions.Users.View],
      },
      {
        to: "/roles",
        labelKey: "roles",
        icon: ShieldCheck,
        perms: [IdentityPermissions.Roles.View],
      },
      {
        to: "/impersonation",
        labelKey: "impersonation",
        icon: UserCog,
        perms: [IdentityPermissions.Impersonation.View],
      },
    ],
  },
  {
    id: "operations",
    captionKey: "operations",
    icon: Activity,
    items: [
      {
        to: "/billing",
        labelKey: "billing",
        icon: Receipt,
        perms: [BillingPermissions.View],
      },
      {
        to: "/webhooks",
        labelKey: "webhooks",
        icon: Webhook,
        perms: [WebhooksPermissions.Subscriptions.View],
      },
      {
        to: "/audits",
        labelKey: "audits",
        icon: ScrollText,
        perms: [AuditingPermissions.AuditTrails.View],
      },
      {
        to: "/health",
        labelKey: "health",
        icon: Activity,
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Find the section id whose items contain the given path (best prefix match). */
export function findSectionForPath(pathname: string): string | null {
  let bestId: string | null = null;
  let bestLen = 0;
  for (const s of sections) {
    for (const item of s.items) {
      if (
        (item.to === "/" && pathname === "/") ||
        (item.to !== "/" && pathname.startsWith(item.to))
      ) {
        if (item.to.length > bestLen) {
          bestLen = item.to.length;
          bestId = s.id;
        }
      }
    }
  }
  return bestId;
}

/** Returns true when the given NavSpec is the active route. */
export function isNavItemActive(item: NavSpec, pathname: string): boolean {
  if (item.to === "/") return pathname === "/";
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

/** Filter nav items (and sections) based on granted permissions. */
export function filterNavSpec(items: NavSpec[], granted: readonly string[]): NavSpec[] {
  return items.filter((item) => {
    if (!item.perms || item.perms.length === 0) return true;
    return item.perms.every((p) => granted.includes(p));
  });
}

// ── Legacy flat export (used by sidebar-content & permission gating elsewhere) ──

/** @deprecated Use sections / topNavTop / topNavBottom instead. */
export type NavItem = NavSpec & { matchPrefix?: string };

/** @deprecated Flat list kept only for call-sites still importing NAV_ITEMS. */
export const NAV_ITEMS: NavItem[] = [
  { to: "/", labelKey: "overview", icon: LayoutDashboard },
  {
    to: "/tenants",
    labelKey: "tenants",
    icon: Building2,
    matchPrefix: "/tenants",
    perms: [MultitenancyPermissions.Tenants.View],
  },
  {
    to: "/users",
    labelKey: "users",
    icon: UsersRound,
    matchPrefix: "/users",
    perms: [IdentityPermissions.Users.View],
  },
  {
    to: "/roles",
    labelKey: "roles",
    icon: ShieldCheck,
    matchPrefix: "/roles",
    perms: [IdentityPermissions.Roles.View],
  },
  {
    to: "/billing",
    labelKey: "billing",
    icon: Receipt,
    matchPrefix: "/billing",
    perms: [BillingPermissions.View],
  },
  {
    to: "/impersonation",
    labelKey: "impersonation",
    icon: UserCog,
    matchPrefix: "/impersonation",
    perms: [IdentityPermissions.Impersonation.View],
  },
  {
    to: "/audits",
    labelKey: "audits",
    icon: ScrollText,
    matchPrefix: "/audits",
    perms: [AuditingPermissions.AuditTrails.View],
  },
  {
    to: "/webhooks",
    labelKey: "webhooks",
    icon: Webhook,
    matchPrefix: "/webhooks",
    perms: [WebhooksPermissions.Subscriptions.View],
  },
  { to: "/health", labelKey: "health", icon: Activity, matchPrefix: "/health" },
];

/** @deprecated Use filterNavSpec instead. */
export function filterNavItems(items: NavItem[], grantedPermissions: readonly string[]): NavItem[] {
  return items.filter((item) => {
    if (!item.perms || item.perms.length === 0) return true;
    return item.perms.every((p) => grantedPermissions.includes(p));
  });
}
