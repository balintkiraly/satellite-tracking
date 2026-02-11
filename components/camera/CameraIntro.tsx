"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const DURATION = 3.2;
const START_RADIUS = 110;
const END_RADIUS = 20;
const START_ANGLE = 1; // radians – start off-center
const END_ANGLE = 0;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface CameraIntroProps {
  onComplete: () => void;
  delay?: number; // optional delay in seconds
}

export default function CameraIntro({ onComplete, delay = 0 }: CameraIntroProps) {
  const { camera } = useThree();
  const startTime = useRef<number | null>(null);
  const done = useRef(false);

  useEffect(() => {
    startTime.current = null;
  }, []);

  useFrame((_, delta) => {
    if (done.current) return;

    const now = performance.now() / 1000;

    // Start time with delay
    if (startTime.current === null) startTime.current = now + delay;

    const elapsed = now - startTime.current;

    // Wait if we're still in the delay period
    if (elapsed < 0) return;

    if (elapsed >= DURATION) {
      camera.position.set(0, 0, END_RADIUS);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      done.current = true;
      onComplete();
      return;
    }

    const t = easeOutCubic(elapsed / DURATION);
    const radius = START_RADIUS + (END_RADIUS - START_RADIUS) * t;
    const angle = START_ANGLE + (END_ANGLE - START_ANGLE) * t;

    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    camera.position.set(x, 0, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  return null;
}
