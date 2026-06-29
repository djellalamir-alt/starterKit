import type { TFunction } from "i18next";

export const ERROR_CODE_TRANSLATION_KEYS: Record<string, string> = {
  USER_NOT_FOUND: "errors:userNotFound",
  INVALID_CREDENTIALS: "errors:invalidCredentials",
  FORBIDDEN: "errors:forbidden",
  TENANT_NOT_FOUND: "errors:tenantNotFound",
  VALIDATION_FAILED: "errors:validationFailed",
  UNAUTHORIZED: "errors:unauthorized",
};

type ProblemDetails = {
  status?: number;
  title?: string;
  detail?: string;
  code?: string;
  extensions?: Record<string, unknown>;
};

function problemFrom(error: unknown): ProblemDetails | null {
  if (!error || typeof error !== "object") return null;
  const candidate = error as { problem?: ProblemDetails; status?: number; code?: string; title?: string; message?: string };
  return candidate.problem ?? candidate;
}

export function getApiErrorTranslationKey(error: unknown): string | null {
  const problem = problemFrom(error);
  if (!problem) return null;
  const code =
    problem.code ??
    (typeof problem.extensions?.code === "string" ? problem.extensions.code : undefined) ??
    (typeof problem.extensions?.errorCode === "string" ? problem.extensions.errorCode : undefined);
  if (code && ERROR_CODE_TRANSLATION_KEYS[code]) return ERROR_CODE_TRANSLATION_KEYS[code];
  if (problem.status === 401) return "errors:unauthorized";
  if (problem.status === 403) return "errors:forbidden";
  if (problem.status === 404) return "errors:notFound";
  if (problem.status === 429) return "errors:rateLimited";
  if (problem.status && problem.status >= 500) return "errors:server";
  return null;
}

export function localizeApiError(error: unknown, t: TFunction): string {
  const key = getApiErrorTranslationKey(error);
  if (key) return t(key);
  const problem = problemFrom(error);
  if (problem?.detail) return problem.detail;
  if (problem?.title) return problem.title;
  if (error instanceof Error) return error.message;
  return t("errors:generic");
}
