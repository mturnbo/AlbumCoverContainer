require('../src/AlbumCoverContainer.js');

const AlbumCoverContainer = window.AlbumCoverContainer;

// ── Constructor / param validation ───────────────────────────────────────────

describe('constructor defaults', () => {
  test('applies default options when none provided', () => {
    const c = new AlbumCoverContainer('cover.png');
    expect(c.width).toBe(300);
    expect(c.height).toBe(420);
    expect(c.padding).toBe(10);
    expect(c.borderRadius).toBe(0);
    expect(c.gradientIntensity).toBe(10);
  });

  test('stores imageUrl', () => {
    const c = new AlbumCoverContainer('my-cover.png');
    expect(c.imageUrl).toBe('my-cover.png');
  });
});

describe('param clamping', () => {
  test('clamps padding below minimum to 5', () => {
    expect(new AlbumCoverContainer('x.png', { padding: 1 }).padding).toBe(5);
  });

  test('clamps padding above maximum to 40', () => {
    expect(new AlbumCoverContainer('x.png', { padding: 99 }).padding).toBe(40);
  });

  test('clamps borderRadius above maximum to 20', () => {
    expect(new AlbumCoverContainer('x.png', { borderRadius: 99 }).borderRadius).toBe(20);
  });

  test('clamps borderRadius below minimum to 0', () => {
    expect(new AlbumCoverContainer('x.png', { borderRadius: -5 }).borderRadius).toBe(0);
  });

  test('clamps gradientIntensity above 100 to 100', () => {
    expect(new AlbumCoverContainer('x.png', { gradientIntensity: 200 }).gradientIntensity).toBe(100);
  });

  test('clamps gradientIntensity below 0 to 0', () => {
    expect(new AlbumCoverContainer('x.png', { gradientIntensity: -10 }).gradientIntensity).toBe(0);
  });

  test('accepts valid values unchanged', () => {
    const c = new AlbumCoverContainer('x.png', {
      padding: 20,
      borderRadius: 12,
      gradientIntensity: 50,
    });
    expect(c.padding).toBe(20);
    expect(c.borderRadius).toBe(12);
    expect(c.gradientIntensity).toBe(50);
  });
});

// ── render() ─────────────────────────────────────────────────────────────────

describe('render()', () => {
  test('returns a DOM element', () => {
    const c = new AlbumCoverContainer('cover.png');
    const el = c.render();
    expect(el).toBeInstanceOf(HTMLElement);
  });

  test('container has correct width and height styles', () => {
    const c = new AlbumCoverContainer('cover.png', { width: 280, height: 400 });
    const el = c.render();
    expect(el.style.width).toBe('280px');
    expect(el.style.height).toBe('400px');
  });

  test('container has correct borderRadius style', () => {
    const c = new AlbumCoverContainer('cover.png', { borderRadius: 16 });
    const el = c.render();
    expect(el.style.borderRadius).toBe('16px');
  });

  test('img child has correct src', () => {
    const c = new AlbumCoverContainer('assets/my-album.png');
    const el = c.render();
    const img = el.querySelector('img');
    expect(img.src).toContain('assets/my-album.png');
  });

  test('img is square (width equals height)', () => {
    const c = new AlbumCoverContainer('cover.png', { width: 260, padding: 10 });
    const el = c.render();
    const img = el.querySelector('img');
    expect(img.style.width).toBe(img.style.height);
  });

  test('img size respects padding', () => {
    const c = new AlbumCoverContainer('cover.png', { width: 200, padding: 10 });
    const el = c.render();
    const img = el.querySelector('img');
    // width * (1 - (padding * 2) / 100) = 200 * (1 - 0.2) = 160
    expect(img.style.width).toBe('160px');
  });

  test('calling render() twice throws or replaces cleanly (does not crash)', () => {
    const c = new AlbumCoverContainer('cover.png');
    expect(() => {
      c.render();
      c.render();
    }).not.toThrow();
  });
});

// ── destroy() ────────────────────────────────────────────────────────────────

describe('destroy()', () => {
  test('removes container from the DOM', () => {
    const c = new AlbumCoverContainer('cover.png');
    const parent = document.createElement('div');
    document.body.appendChild(parent);
    parent.appendChild(c.render());

    expect(parent.children.length).toBe(1);
    c.destroy();
    expect(parent.children.length).toBe(0);

    document.body.removeChild(parent);
  });

  test('nulls internal references after destroy', () => {
    const c = new AlbumCoverContainer('cover.png');
    c.render();
    c.destroy();
    expect(c._container).toBeNull();
    expect(c._img).toBeNull();
  });

  test('calling destroy() before render() does not throw', () => {
    const c = new AlbumCoverContainer('cover.png');
    expect(() => c.destroy()).not.toThrow();
  });

  test('calling destroy() twice does not throw', () => {
    const c = new AlbumCoverContainer('cover.png');
    const parent = document.createElement('div');
    document.body.appendChild(parent);
    parent.appendChild(c.render());
    c.destroy();
    expect(() => c.destroy()).not.toThrow();
    document.body.removeChild(parent);
  });
});

// ── _applyBackground() ───────────────────────────────────────────────────────

describe('_applyBackground()', () => {
  test('sets a linear-gradient background on the container', () => {
    const c = new AlbumCoverContainer('cover.png', { gradientIntensity: 0 });
    c.render();
    c._applyBackground({ r: 100, g: 50, b: 200 });
    expect(c._container.style.background).toContain('linear-gradient');
  });

  test('gradient starts with the dominant color', () => {
    const c = new AlbumCoverContainer('cover.png', { gradientIntensity: 0 });
    c.render();
    c._applyBackground({ r: 100, g: 50, b: 200 });
    expect(c._container.style.background).toContain('rgb(100,50,200)');
  });

  test('end color is lighter when gradientIntensity > 0', () => {
    const c = new AlbumCoverContainer('cover.png', { gradientIntensity: 100 });
    c.render();
    c._applyBackground({ r: 0, g: 0, b: 0 });
    // shift = round((100/100) * 80) = 80, so end color = rgb(80,80,80)
    expect(c._container.style.background).toContain('rgb(80,80,80)');
  });

  test('end color clamps at 255', () => {
    const c = new AlbumCoverContainer('cover.png', { gradientIntensity: 100 });
    c.render();
    c._applyBackground({ r: 255, g: 255, b: 255 });
    expect(c._container.style.background).toContain('rgb(255,255,255)');
  });
});
