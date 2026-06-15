# Album Cover Container

A lightweight, framework-agnostic JavaScript component that generates a dominant-color gradient background container for album cover images. Drop in a single script tag — no build step, no dependencies.

---

## Demo

Open `index.html` via a local server:

```bash
npx serve .
```

---

## How It Works

1. Loads the album image into an offscreen `<canvas>`
2. Samples pixels at 50×50 resolution and quantizes RGB channels to find the dominant color
3. Renders a vertically-oriented rectangle with a gradient derived from that color
4. Centers the square album art near the top of the container

> **Note:** Images must be same-origin. Cross-origin images will cause the browser to taint the canvas and throw a `SecurityError`.

---

## Installation

Copy `src/AlbumCoverContainer.js` into your project and include it with a script tag:

```html
<script src="/path/to/AlbumCoverContainer.js"></script>
```

---

## Parameters

| Parameter          | Type     | Default | Constraints       | Description                                      |
|--------------------|----------|---------|-------------------|--------------------------------------------------|
| `imageUrl`         | `string` | —       | Required          | Same-origin URL of the album cover image         |
| `width`            | `number` | `300`   | px                | Container width                                  |
| `height`           | `number` | `420`   | px                | Container height                                 |
| `padding`          | `number` | `10`    | min `5`, max `40` | Image inset as a percentage of container width   |
| `borderRadius`     | `number` | `0`     | max `20`          | Corner radius in px                              |
| `gradientIntensity`| `number` | `10`    | `0`–`100`         | How much the gradient lightens toward the bottom |

---

## Usage

### Vanilla JS

Include the script tag once, then instantiate anywhere in the page:

```html
<script src="./src/AlbumCoverContainer.js"></script>

<div id="my-player">
  <script>
    (function () {
      const options = { width: 260, height: 360, borderRadius: 12, gradientIntensity: 20 };
      const container = new AlbumCoverContainer('assets/cover.png', options);
      document.currentScript.parentElement.appendChild(container.render());
    })();
  </script>
</div>
```

### API

```js
// Create an instance
const container = new AlbumCoverContainer(imageUrl, options);

// Render — returns a DOM element, does not append it
const el = container.render();
document.getElementById('my-slot').appendChild(el);

// Destroy — removes the element and cleans up
container.destroy();
```

---

## Angular

Load the script globally (e.g. via `angular.json` `scripts` or `index.html`), then use the wrapper component:

```json
// angular.json
"scripts": ["src/AlbumCoverContainer.js"]
```

```ts
// app.module.ts
import { AlbumCoverContainerComponent } from './adapters/angular/album-cover-container.component';

@NgModule({
  declarations: [AlbumCoverContainerComponent],
  ...
})
```

```html
<album-cover-container
  imageUrl="assets/cover.png"
  [width]="300"
  [height]="420"
  [borderRadius]="12"
  [gradientIntensity]="20"
/>
```

Requires Angular ≥ 14. Re-renders automatically when any `@Input` changes via `ngOnChanges`.

---

## React

Load the script globally in `public/index.html` (CRA) or `index.html` (Vite), then use the wrapper component:

```html
<!-- public/index.html -->
<script src="/AlbumCoverContainer.js"></script>
```

```jsx
import { AlbumCoverContainerComponent } from './adapters/react/AlbumCoverContainer';

function NowPlaying() {
  return (
    <AlbumCoverContainerComponent
      imageUrl="assets/cover.png"
      width={300}
      height={420}
      borderRadius={12}
      gradientIntensity={20}
    />
  );
}
```

Requires React ≥ 16.8. Re-renders automatically when any prop changes.

---

## Vue

Load the script globally in `index.html`, then use the wrapper component:

```html
<!-- index.html -->
<script src="/AlbumCoverContainer.js"></script>
```

```js
import AlbumCoverContainerComponent from './adapters/vue/AlbumCoverContainer.vue';

export default {
  components: { AlbumCoverContainerComponent },
};
```

```html
<AlbumCoverContainerComponent
  imageUrl="assets/cover.png"
  :width="300"
  :height="420"
  :borderRadius="12"
  :gradientIntensity="20"
/>
```

Requires Vue 3. Re-renders automatically when any prop changes.

---

## Svelte

Load the script globally in `app.html` (SvelteKit) or `index.html` (Vite), then import the component:

```html
<!-- app.html / index.html -->
<script src="/AlbumCoverContainer.js"></script>
```

```svelte
<script>
  import AlbumCoverContainer from './adapters/svelte/AlbumCoverContainer.svelte';
</script>

<AlbumCoverContainer
  imageUrl="assets/cover.png"
  width={300}
  height={420}
  borderRadius={12}
  gradientIntensity={20}
/>
```

Requires Svelte ≥ 3. Re-renders automatically when any prop changes.

---

## License

MIT
