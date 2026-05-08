/** Duração máxima aceita para o access token (15 min), alinhada ao backend. */
const MAX_ACCESS_TTL_SEC = 15 * 60;

export interface JwtPayload {
  exp?: number;
  iat?: number;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);
    const json = atob(base64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Instant em ms em que o token deixa de ser aceito no app (exp do JWT, limitado a 15 min após iat). */
export function getAccessTokenExpiresAtMs(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  if (payload.exp != null) {
    if (payload.iat != null) {
      const cappedExpSec = Math.min(payload.exp, payload.iat + MAX_ACCESS_TTL_SEC);
      return cappedExpSec * 1000;
    }
    return payload.exp * 1000;
  }

  if (payload.iat != null) {
    return (payload.iat + MAX_ACCESS_TTL_SEC) * 1000;
  }

  return null;
}

export function isAccessTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const at = getAccessTokenExpiresAtMs(token);
  if (at == null) return false;
  return Date.now() >= at;
}
