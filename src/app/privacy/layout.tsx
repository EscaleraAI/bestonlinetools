import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BestOnline.Tools',
  description:
    'BestOnline.Tools privacy policy: all file processing happens locally in your browser. We use Google Analytics for aggregate usage statistics — no personal data is tied to your files.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
