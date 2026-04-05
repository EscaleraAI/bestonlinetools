import type { Metadata } from 'next';

const SITE_NAME = 'BestOnline.Tools';
const SITE_URL = 'https://bestonline.tools';

export function createToolMetadata(params: {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
}): Metadata {
  const fullTitle = `${params.title} — Free Online Tool | ${SITE_NAME}`;
  const url = `${SITE_URL}/tools/${params.slug}`;

  return {
    title: fullTitle,
    description: params.description,
    keywords: params.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: params.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: params.description,
    },
  };
}

export function createBaseMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} — Free Online Conversion Tools`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      'Free online file conversion tools. Convert images to SVG, compress files, convert PDFs — all running in your browser. Fast, private, no upload required.',
    keywords: [
      'online converter',
      'file conversion',
      'png to svg',
      'image converter',
      'free online tools',
      'pdf converter',
    ],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title: `${SITE_NAME} — Free Online Conversion Tools`,
      description:
        'Free online file conversion tools that run in your browser. Fast, private, no upload required.',
      url: SITE_URL,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [{
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'BestOnline.Tools — Free Online Tools',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — Free Online Conversion Tools`,
      description:
        'Free online file conversion tools that run in your browser. Fast, private, no upload required.',
      images: [`${SITE_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export { SITE_NAME, SITE_URL };
