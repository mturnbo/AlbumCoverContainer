<template>
  <div ref="mountRef" />
</template>

<script>
// AlbumCoverContainer must be loaded globally via a <script> tag before this component mounts.
// e.g. <script src="/path/to/AlbumCoverContainer.js"><\/script>

export default {
  name: 'AlbumCoverContainer',

  props: {
    imageUrl:          { type: String,  required: true },
    width:             { type: Number,  default: 300 },
    height:            { type: Number,  default: 420 },
    padding:           { type: Number,  default: 10 },
    borderRadius:      { type: Number,  default: 0 },
    gradientIntensity: { type: Number,  default: 10 },
  },

  data() {
    return { _instance: null };
  },

  watch: {
    imageUrl()          { this._render(); },
    width()             { this._render(); },
    height()            { this._render(); },
    padding()           { this._render(); },
    borderRadius()      { this._render(); },
    gradientIntensity() { this._render(); },
  },

  mounted() {
    this._render();
  },

  beforeUnmount() {
    this._destroy();
  },

  methods: {
    _render() {
      this._destroy();
      /* global AlbumCoverContainer */
      this._instance = new AlbumCoverContainer(this.imageUrl, {
        width:             this.width,
        height:            this.height,
        padding:           this.padding,
        borderRadius:      this.borderRadius,
        gradientIntensity: this.gradientIntensity,
      });
      this.$refs.mountRef.appendChild(this._instance.render());
    },

    _destroy() {
      if (this._instance) {
        this._instance.destroy();
        this._instance = null;
      }
    },
  },
};
</script>
