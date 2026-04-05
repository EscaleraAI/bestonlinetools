'use client';

import dynamic from 'next/dynamic';

const VectorizerTool = dynamic(
  () => import('@/tools/vectorizer/VectorizerTool'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-sm)',
      }}>
        Loading vectorization engine...
      </div>
    ),
  }
);

export default function VectorizerToolWrapper() {
  return <VectorizerTool />;
}
