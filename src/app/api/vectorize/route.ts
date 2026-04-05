import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read options from form data
    const colorMode = formData.get('colorMode') as string || 'color';
    const mode = formData.get('mode') as string || 'spline';
    const filterSpeckle = Number(formData.get('filterSpeckle') || 4);
    const cornerThreshold = Number(formData.get('cornerThreshold') || 60);
    const lengthThreshold = Number(formData.get('lengthThreshold') || 4.0);
    const maxIterations = Number(formData.get('maxIterations') || 10);
    const spliceThreshold = Number(formData.get('spliceThreshold') || 45);
    const pathPrecision = Number(formData.get('pathPrecision') || 3);
    const colorPrecision = Number(formData.get('colorPrecision') || 6);
    const layerDifference = Number(formData.get('layerDifference') || 6);
    const hierarchical = formData.get('hierarchical') as string || 'stacked';

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use numeric values to avoid isolatedModules const enum issue
    // ColorMode: Color=0, Binary=1
    // Hierarchical: Stacked=0, Cutout=1
    // PathSimplifyMode: None=0, Polygon=1, Spline=2
    const config = {
      colorMode: colorMode === 'color' ? 0 : 1,
      hierarchical: hierarchical === 'cutout' ? 1 : 0,
      filterSpeckle,
      colorPrecision,
      layerDifference,
      mode: mode === 'polygon' ? 1 : mode === 'none' ? 0 : 2,
      cornerThreshold,
      lengthThreshold,
      maxIterations,
      spliceThreshold,
      pathPrecision,
    };

    const { vectorize } = await import('@neplex/vectorizer');
    const svg = await vectorize(buffer, config);

    return NextResponse.json({
      svg,
      svgSize: new Blob([svg]).size,
    });
  } catch (err) {
    console.error('Vectorization error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Vectorization failed' },
      { status: 500 }
    );
  }
}
