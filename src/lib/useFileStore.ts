'use client';

/**
 * Global file handoff store.
 *
 * Enables "Zero-Upload" cross-tool file transfer:
 * - User processes file in Tool A
 * - Clicks cross-link to Tool B
 * - Tool B instantly loads the file from this store
 *
 * Uses Zustand for in-memory state + IndexedDB for persistence
 * across hard navigations and mobile browser memory purges.
 */

import { create } from 'zustand';
import { get, set, del } from 'idb-keyval';

const IDB_KEY = 'handoff_files';

export interface HandoffFile {
  /** Original file name */
  name: string;
  /** MIME type */
  type: string;
  /** File size in bytes */
  size: number;
  /** The actual file data as ArrayBuffer (serializable to IndexedDB) */
  data: ArrayBuffer;
  /** Which tool produced this file */
  sourceTool: string;
  /** Timestamp of creation */
  createdAt: number;
}

interface FileStoreState {
  /** Files ready for handoff to another tool */
  files: HandoffFile[];
  /** Whether the store has been hydrated from IndexedDB */
  hydrated: boolean;

  /** Add files for cross-tool handoff */
  setFiles: (files: HandoffFile[]) => void;
  /** Clear all handoff files */
  clearFiles: () => void;
  /** Hydrate from IndexedDB (call once on app mount) */
  hydrate: () => Promise<void>;
}

export const useFileStore = create<FileStoreState>((setState, getState) => ({
  files: [],
  hydrated: false,

  setFiles: (files) => {
    setState({ files });
    // Persist to IndexedDB asynchronously
    set(IDB_KEY, files).catch(console.error);
  },

  clearFiles: () => {
    setState({ files: [] });
    del(IDB_KEY).catch(console.error);
  },

  hydrate: async () => {
    if (getState().hydrated) return;
    try {
      const stored = await get<HandoffFile[]>(IDB_KEY);
      if (stored && stored.length > 0) {
        // Discard files older than 30 minutes (stale handoffs)
        const cutoff = Date.now() - 30 * 60 * 1000;
        const fresh = stored.filter((f) => f.createdAt > cutoff);
        if (fresh.length !== stored.length) {
          // Clean up stale entries
          if (fresh.length > 0) {
            await set(IDB_KEY, fresh);
          } else {
            await del(IDB_KEY);
          }
        }
        setState({ files: fresh, hydrated: true });
      } else {
        setState({ hydrated: true });
      }
    } catch {
      setState({ hydrated: true });
    }
  },
}));

/**
 * Helper: Convert a File/Blob to a HandoffFile for storage.
 */
export async function toHandoffFile(
  file: File | Blob,
  sourceTool: string,
  name?: string,
): Promise<HandoffFile> {
  const data = await file.arrayBuffer();
  return {
    name: name || (file instanceof File ? file.name : 'output'),
    type: file.type,
    size: file.size,
    data,
    sourceTool,
    createdAt: Date.now(),
  };
}

/**
 * Helper: Convert a HandoffFile back to a File object.
 */
export function toFile(handoff: HandoffFile): File {
  return new File([handoff.data], handoff.name, { type: handoff.type });
}
