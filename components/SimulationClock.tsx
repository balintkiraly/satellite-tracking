import { useFrame } from "@react-three/fiber";
import { useSimTime } from "@/lib/simTime";

export const SimulationClock = () => {
  const tick = useSimTime((s) => s.tick);

  useFrame((_, delta) => {
    tick(delta);
  });

  return null;
}
