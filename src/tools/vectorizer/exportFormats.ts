'use client';

export type ExportFormat = 'svg' | 'pdf' | 'eps' | 'dxf';

export const exportFormats: { value: ExportFormat; label: string; description: string }[] = [
  { value: 'svg', label: 'SVG', description: 'Scalable Vector Graphics' },
  { value: 'pdf', label: 'PDF', description: 'Portable Document Format' },
  { value: 'eps', label: 'EPS', description: 'Encapsulated PostScript' },
  { value: 'dxf', label: 'DXF', description: 'AutoCAD Drawing Exchange' },
];

/**
 * Get dimensions from an SVG string by parsing its viewBox or width/height.
 */
function getSvgDimensions(svgString: string): { width: number; height: number } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return { width: 800, height: 600 };

  const viewBox = svgEl.getAttribute('viewBox');
  if (viewBox) {
    const parts = viewBox.split(/[\s,]+/).map(Number);
    if (parts.length === 4) return { width: parts[2], height: parts[3] };
  }

  const w = parseFloat(svgEl.getAttribute('width') || '800');
  const h = parseFloat(svgEl.getAttribute('height') || '600');
  return { width: w, height: h };
}

/**
 * Export SVG as PDF using jsPDF + svg2pdf.js
 */
export async function exportAsPdf(svgString: string, filename: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  await import('svg2pdf.js');

  const { width, height } = getSvgDimensions(svgString);
  const orientation = width > height ? 'landscape' : 'portrait';

  const doc = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
  });

  // Parse SVG into DOM element
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svgDoc.querySelector('svg');
  if (!svgElement) throw new Error('Invalid SVG');

  await doc.svg(svgElement, { x: 0, y: 0, width, height });
  doc.save(`${filename}.pdf`);
}

/**
 * Export SVG as EPS (simplified PostScript conversion)
 */
export function exportAsEps(svgString: string, filename: string): void {
  const { width, height } = getSvgDimensions(svgString);

  // Build a minimal EPS wrapper that embeds the SVG as XML
  const eps = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 ${Math.round(width)} ${Math.round(height)}
%%Title: ${filename}
%%Creator: BestOnline.Tools SVG Vectorizer
%%CreationDate: ${new Date().toISOString()}
%%DocumentData: Clean7Bit
%%LanguageLevel: 2
%%EndComments

% This EPS file contains embedded SVG data.
% For best results, open in Adobe Illustrator or Inkscape.
% The SVG content is embedded as a data comment block.

%%BeginDocument: ${filename}.svg
% SVG-DATA-BEGIN
${svgString.split('\n').map(line => `% ${line}`).join('\n')}
% SVG-DATA-END
%%EndDocument

% Render bounding box
newpath
0 0 moveto
${Math.round(width)} 0 lineto
${Math.round(width)} ${Math.round(height)} lineto
0 ${Math.round(height)} lineto
closepath
clip

showpage
%%EOF
`;

  downloadBlob(eps, `${filename}.eps`, 'application/postscript');
}

/**
 * Export SVG paths as DXF (AutoCAD Drawing Exchange Format)
 */
export function exportAsDxf(svgString: string, filename: string): void {
  const { width, height } = getSvgDimensions(svgString);

  // Extract path data from SVG
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const paths = doc.querySelectorAll('path');

  let entities = '';
  paths.forEach((path) => {
    const d = path.getAttribute('d');
    if (!d) return;

    // Convert SVG path M/L commands to DXF POLYLINE
    // This handles basic move/line commands
    const commands = d.match(/[MLZHVCSQTAmlzhvcsqta][^MLZHVCSQTAmlzhvcsqta]*/g) || [];
    const points: [number, number][] = [];
    let cx = 0, cy = 0;

    for (const cmd of commands) {
      const type = cmd[0];
      const nums = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

      switch (type) {
        case 'M':
          cx = nums[0]; cy = nums[1];
          points.push([cx, height - cy]); // Flip Y for DXF
          break;
        case 'L':
          cx = nums[0]; cy = nums[1];
          points.push([cx, height - cy]);
          break;
        case 'm':
          cx += nums[0]; cy += nums[1];
          points.push([cx, height - cy]);
          break;
        case 'l':
          cx += nums[0]; cy += nums[1];
          points.push([cx, height - cy]);
          break;
        case 'H':
          cx = nums[0];
          points.push([cx, height - cy]);
          break;
        case 'h':
          cx += nums[0];
          points.push([cx, height - cy]);
          break;
        case 'V':
          cy = nums[0];
          points.push([cx, height - cy]);
          break;
        case 'v':
          cy += nums[0];
          points.push([cx, height - cy]);
          break;
      }
    }

    // Write as DXF LWPOLYLINE
    if (points.length > 1) {
      entities += '  0\nLWPOLYLINE\n  8\n0\n  90\n' + points.length + '\n  70\n0\n';
      for (const [x, y] of points) {
        entities += `  10\n${x.toFixed(4)}\n  20\n${y.toFixed(4)}\n`;
      }
    }
  });

  const dxf = `  0
SECTION
  2
HEADER
  9
$EXTMIN
  10
0.0
  20
0.0
  9
$EXTMAX
  10
${width.toFixed(4)}
  20
${height.toFixed(4)}
  0
ENDSEC
  0
SECTION
  2
ENTITIES
${entities}  0
ENDSEC
  0
EOF
`;

  downloadBlob(dxf, `${filename}.dxf`, 'application/dxf');
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
