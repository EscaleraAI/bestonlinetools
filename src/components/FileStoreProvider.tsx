'use client';

/**
 * FileStoreProvider: Hydrates the file handoff store from IndexedDB on mount.
 * Add this to your root layout to ensure files persist across navigations.
 */

import { useEffect } from 'react';
import { useFileStore } from '@/lib/useFileStore';

export default function FileStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrate = useFileStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
