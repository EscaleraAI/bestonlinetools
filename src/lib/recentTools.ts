/**
 * Recently Used Tools — per-user via localStorage.
 * Stores the last N tool IDs the user visited.
 * No account needed, no backend. Cleared with browser data.
 */

const STORAGE_KEY = 'bot_recent_tools';
const MAX_RECENT = 5;

export interface RecentToolEntry {
  toolId: string;
  timestamp: number;
}

/** Add a tool to the recently used list (moves to top if already present). */
export function addRecentTool(toolId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getRecentEntries();
    // Remove if already present (will re-add at top)
    const filtered = existing.filter((e) => e.toolId !== toolId);
    // Prepend new entry
    const updated = [{ toolId, timestamp: Date.now() }, ...filtered].slice(
      0,
      MAX_RECENT,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be full or disabled — silently ignore
  }
}

/** Get the list of recently used tool IDs (most recent first). */
export function getRecentToolIds(): string[] {
  return getRecentEntries().map((e) => e.toolId);
}

/** Internal: parse stored entries with safety checks. */
function getRecentEntries(): RecentToolEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e: unknown) =>
        typeof e === 'object' &&
        e !== null &&
        'toolId' in e &&
        typeof (e as RecentToolEntry).toolId === 'string',
    );
  } catch {
    return [];
  }
}

/** Clear all recent tools (useful for testing or a "clear history" button). */
export function clearRecentTools(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
