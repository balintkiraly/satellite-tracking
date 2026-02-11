import { useMemo } from "react";
import { BufferGeometry, BufferAttribute } from "three";

export default function RealStars({ count = 5000 }) {
  const stars = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2000; // spread stars in space
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, [count]);

  return (
    <points geometry={stars}>
      <pointsMaterial color="white" size={0.3} sizeAttenuation />
    </points>
  );
}