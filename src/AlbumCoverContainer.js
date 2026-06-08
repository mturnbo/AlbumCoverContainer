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
}
