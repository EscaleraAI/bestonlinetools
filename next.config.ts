import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude native Node.js addons from bundling
  serverExternalPackages: ['@neplex/vectorizer'],
  // Redirect old routes to new i18n structure
  async redirects() {
    return [
      {
        source: '/tools/vectorizer',
        destination: '/image/png-to-svg',
        permanent: true,
      },
    ];
  },
  // Required for FFmpeg.wasm SharedArrayBuffer (multi-threaded WASM)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
      // Long cache for WASM modules (immutable, 1 year)
      {
        source: '/:path*.wasm',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Content-Type', value: 'application/wasm' },
        ],
      },
      // Long cache for ONNX model files
      {
        source: '/:path*.onnx',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  // Enable WASM support for the vectortracer module
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  // Required: add turbopack config so Next.js allows webpack config too
  turbopack: {},
};

export default nextConfig;
