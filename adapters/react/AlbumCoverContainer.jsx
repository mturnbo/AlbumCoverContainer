import { useEffect, useRef } from 'react';

// AlbumCoverContainer must be loaded globally via a <script> tag before this component mounts.
// e.g. <script src="/path/to/AlbumCoverContainer.js"></script>

/**
 * @param {object}  props
 * @param {string}  props.imageUrl          - Same-origin image URL
 * @param {number}  [props.width=300]       - Container width in px
 * @param {number}  [props.height=420]      - Container height in px
 * @param {number}  [props.padding=10]      - Image padding as % of width (5–40)
 * @param {number}  [props.borderRadius=0]  - Corner radius in px (0–20)
 * @param {number}  [props.gradientIntensity=10] - Gradient strength as % (0–100)
 */
export function AlbumCoverContainerComponent({
  imageUrl,
  width = 300,
  height = 420,
  padding = 10,
  borderRadius = 0,
  gradientIntensity = 10,
}) {
  const mountRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const instance = new window.AlbumCoverContainer(imageUrl, {
      width,
      height,
      padding,
      borderRadius,
      gradientIntensity,
    });
    instanceRef.current = instance;
    mountRef.current.appendChild(instance.render());

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, []);

  return <div ref={mountRef} />;
}
