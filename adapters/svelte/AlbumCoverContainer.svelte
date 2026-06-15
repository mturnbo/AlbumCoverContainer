<script>
  // AlbumCoverContainer must be loaded globally via a <script> tag before this component mounts.
  // e.g. <script src="/path/to/AlbumCoverContainer.js"><\/script>

  import { onMount, onDestroy } from 'svelte';

  export let imageUrl;
  export let width             = 300;
  export let height            = 420;
  export let padding           = 10;
  export let borderRadius      = 0;
  export let gradientIntensity = 10;

  let mountEl;
  let instance = null;

  function render() {
    if (instance) {
      instance.destroy();
    }
    /* global AlbumCoverContainer */
    instance = new AlbumCoverContainer(imageUrl, {
      width,
      height,
      padding,
      borderRadius,
      gradientIntensity,
    });
    mountEl.appendChild(instance.render());
  }

  onMount(() => render());
  onDestroy(() => { if (instance) instance.destroy(); });

  // Re-render whenever any prop changes after mount
  $: if (mountEl) render(imageUrl, width, height, padding, borderRadius, gradientIntensity);
</script>

<div bind:this={mountEl} />
