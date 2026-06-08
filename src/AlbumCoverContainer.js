import { extractDominantColor } from './colorExtractor.js';

export class AlbumCoverContainer {
  constructor(options = {}) {
    this.width = options.width ?? 300;
    this.height = options.height ?? 420;
    this.padding = Math.min(40, Math.max(5, options.padding ?? 10));
    this.borderRadius = Math.min(20, Math.max(0, options.borderRadius ?? 0));
    this.gradientIntensity = Math.min(100, Math.max(0, options.gradientIntensity ?? 10));

    this._container = null;
    this._img = null;
  }

  _buildDOM(imageUrl) {
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
    img.src = imageUrl;
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

  render(imageUrl, targetEl) {
    this._buildDOM(imageUrl);

    this._img.onload = () => {
      const color = extractDominantColor(this._img);
      this._applyBackground(color);
    };

    targetEl.appendChild(this._container);
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

  _applyBackground(color) {
    const { r, g, b } = color;
    const shift = Math.round((this.gradientIntensity / 100) * 80);
    const r2 = Math.min(255, r + shift);
    const g2 = Math.min(255, g + shift);
    const b2 = Math.min(255, b + shift);
    this._container.style.background =
      `linear-gradient(to bottom, rgb(${r},${g},${b}), rgb(${r2},${g2},${b2}))`;
  }
}
