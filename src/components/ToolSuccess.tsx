'use client';

/**
 * ToolSuccessAction: Renders cross-tool action buttons on the success screen.
 * When clicked, saves the current output file(s) to the handoff store
 * and navigates to the target tool.
 */

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFileStore, toHandoffFile } from '@/lib/useFileStore';
import { trackToolUsed, trackDownload } from '@/lib/analytics';
import styles from './ToolSuccess.module.css';

export interface CrossToolLink {
  /** Emoji icon */
  icon: string;
  /** Button label */
  label: string;
  /** Target route (e.g., '/image/compress') */
  href: string;
}

interface ToolSuccessProps {
  /** The output file(s) from the current tool */
  outputFiles: File[];
  /** Which tool produced these files */
  sourceTool: string;
  /** Available cross-tool actions */
  crossLinks: CrossToolLink[];
  /** Primary download handler */
  onDownload: () => void;
}

export default function ToolSuccess({
  outputFiles,
  sourceTool,
  crossLinks,
  onDownload,
}: ToolSuccessProps) {
  const router = useRouter();
  const setFiles = useFileStore((s) => s.setFiles);

  // Track successful tool usage
  useEffect(() => {
    trackToolUsed(sourceTool, { file_count: String(outputFiles.length) });
  }, [sourceTool, outputFiles.length]);

  const handleDownload = useCallback(() => {
    trackDownload(sourceTool);
    onDownload();
  }, [sourceTool, onDownload]);

  const handleCrossLink = useCallback(
    async (href: string) => {
      // Convert output files to handoff format and save to store
      const handoffFiles = await Promise.all(
        outputFiles.map((f) => toHandoffFile(f, sourceTool)),
      );
      setFiles(handoffFiles);

      // Navigate to the target tool — files will be pre-loaded on mount
      router.push(href);
    },
    [outputFiles, sourceTool, setFiles, router],
  );

  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>✅</div>
      <h3 className={styles.successTitle}>
        {outputFiles.length === 1
          ? 'File processed successfully!'
          : `${outputFiles.length} files processed successfully!`}
      </h3>

      <button className={styles.downloadButton} onClick={handleDownload}>
        ⬇️ Download
      </button>

      {crossLinks.length > 0 && (
        <div className={styles.crossLinks}>
          <p className={styles.crossLinksLabel}>What&apos;s next?</p>
          <div className={styles.crossLinksGrid}>
            {crossLinks.map((link) => (
              <button
                key={link.href}
                className={styles.crossLinkButton}
                onClick={() => handleCrossLink(link.href)}
              >
                <span className={styles.crossLinkIcon}>{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
