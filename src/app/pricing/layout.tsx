import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | BestOnline.Tools',
  description:
    'BestOnline.Tools is 100% free. All tools run locally in your browser — no uploads, no limits, no account required.',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
