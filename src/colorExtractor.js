/**
 * Extracts the dominant color from an image element using canvas pixel sampling.
 *
 * @param {HTMLImageElement} imgEl - A loaded image element (same origin)
 * @returns {{ r: number, g: number, b: number }} The dominant color as RGB components (0–255)
 */
export function extractDominantColor(imgEl) {
  const SAMPLE_SIZE = 50;

  // Get the canvas and its 2D rendering context
  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgEl, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  // get pixel data for sample region (Uint8ClampedArray)
  const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  const buckets = {};

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue; // skip transparent pixels

    // Quantize to reduce noise: round each channel to nearest 16
    const r = Math.round(data[i] / 16) * 16;
    const g = Math.round(data[i + 1] / 16) * 16;
    const b = Math.round(data[i + 2] / 16) * 16;

    const key = `${r},${g},${b}`;
    buckets[key] = (buckets[key] ?? 0) + 1;
  }

  let dominantKey = null;
  let maxCount = 0;

  for (const [key, count] of Object.entries(buckets)) {
    if (count > maxCount) {
      maxCount = count;
      dominantKey = key;
    }
  }

  if (!dominantKey) return { r: 0, g: 0, b: 0 };

  const [r, g, b] = dominantKey.split(',').map(Number);
  return { r, g, b };
}
