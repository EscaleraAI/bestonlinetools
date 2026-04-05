'use client';

import { useState } from 'react';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './ToolPageLayout.module.css';

interface ToolPageContentProps {
  faqs?: Array<{ q: string; a: string }>;
  iconName?: string;
}

export default function ToolPageContent({ faqs, iconName }: ToolPageContentProps) {
  // If used as icon renderer
  if (iconName) {
    return <ToolIcon name={iconName} size={18} />;
  }

  // FAQ accordion
  if (faqs && faqs.length > 0) {
    return <FaqAccordion faqs={faqs} />;
  }

  return null;
}

function FaqAccordion({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.faqList}>
      {faqs.map((faq, i) => (
        <div key={i} className={styles.faqItem}>
          <button
            className={styles.faqQuestion}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            type="button"
          >
            {faq.q}
            <span className={`${styles.faqChevron} ${openIndex === i ? styles.faqChevronOpen : ''}`}>
              ▾
            </span>
          </button>
          {openIndex === i && (
            <div className={styles.faqAnswer}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
