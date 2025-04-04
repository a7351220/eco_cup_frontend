import type { Metadata, Viewport } from 'next';

const siteConfig = {
  title: 'CupFi',
  description:
    'CupFi - Sustainable blockchain solutions for a greener future.',
  keywords:
    'CupFi, Sustainability, Blockchain, Green Technology, Eco-friendly, Web3',
  author: 'CupFi Team',
  url: '/',
  image: '/img/cupfi_logo.svg',
} as const;

export const viewport: Viewport = {
  themeColor: '#4CAF50',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
} as const;

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/img/cupfi_logo.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/img/cupfi_logo.svg',
    apple: [
      { url: '/img/cupfi_logo.svg', type: 'image/svg+xml' }
    ],
  },
  openGraph: {
    type: 'website',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.image }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.image],
  },
} as const;
