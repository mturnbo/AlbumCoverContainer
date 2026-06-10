(function (global) {

  /**
   * Extracts the dominant color from a same-origin image element using canvas pixel sampling.
   *
   * @param {HTMLImageElement} imgEl - A loaded image element (same origin)
   * @returns {{ r: number, g: number, b: number }} The dominant color as RGB components (0–255)
   */
  function extractDominantColor(imgEl) {
    const SAMPLE_SIZE = 50;

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

  class AlbumCoverContainer {
    constructor(imageUrl, options = {}) {
      this.imageUrl = imageUrl;
      this.width = options.width ?? 300;
      this.height = options.height ?? 420;
      this.padding = Math.min(40, Math.max(5, options.padding ?? 10));
      this.borderRadius = Math.min(20, Math.max(0, options.borderRadius ?? 0));
      this.gradientIntensity = Math.min(100, Math.max(0, options.gradientIntensity ?? 10));

      this._container = null;
      this._img = null;
    }

    _buildDOM() {
      const imgSize = this.width * (1 - (this.padding * 2) / 100);
      const imgOffset = (this.width - imgSize) / 2;

      const container = document.createElement('div');
      Object.assign(container.style, {
        position: 'relative',
        width: `${this.width}px`,
        height: `${this.height}px`,
        borderRadius: `${this.borderRadius}px`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      });

      const img = document.createElement('img');
      img.src = this.imageUrl;
      Object.assign(img.style, {
        display: 'block',
        width: `${imgSize}px`,
        height: `${imgSize}px`,
        objectFit: 'cover',
        marginTop: `${imgOffset}px`,
        flexShrink: '0',
      });

      container.appendChild(img);
      this._container = container;
      this._img = img;
    }

    _applyBackground(color) {
      const { r, g, b } = color;
      const shift = Math.round((this.gradientIntensity / 100) * 80);
      const r2 = Math.min(255, r + shift);
      const g2 = Math.min(255, g + shift);
      const b2 = Math.min(255, b + shift);
      this._container.style.background =
        `linear-gradient(to bottom, rgb(${r},${g},${b}), rgb(${r2},${g2},${b2}))`;
    }

    render() {
      this._buildDOM();

      this._img.onload = () => {
        const color = extractDominantColor(this._img);
        this._applyBackground(color);
      };

      return this._container;
    }

    destroy() {
      if (this._img) {
        this._img.onload = null;
      }
      if (this._container && this._container.parentNode) {
        this._container.parentNode.removeChild(this._container);
      }
      this._container = null;
      this._img = null;
    }
  }

  global.AlbumCoverContainer = AlbumCoverContainer;

}(typeof window !== 'undefined' ? window : this));
