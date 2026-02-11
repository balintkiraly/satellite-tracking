import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QualityLevel = "low" | "medium" | "high";

export const QUALITY_LABELS: Record<QualityLevel, string> = {
  low: "Low (performance)",
  medium: "Medium",
  high: "High (quality)",
};

/**
 * Earth texture JPG paths per quality (resolution).
 * Low/medium: standard res; High: 8k for better detail at performance cost.
 */
export const EARTH_TEXTURES: Record<QualityLevel, { day: string; night: string; clouds: string }> = {
  low: {
    day: "/textures/earth.jpg",
    night: "/textures/nightmap.jpg",
    clouds: "/textures/earthcloud.jpg",
  },
  medium: {
    day: "/textures/earth.jpg",
    night: "/textures/nightmap.jpg",
    clouds: "/textures/earthcloud.jpg",
  },
  high: {
    day: "/textures/earth8k.jpg",
    night: "/textures/nightmap8k.jpg",
    clouds: "/textures/earthcloud8k.jpg",
  },
};

/** Sphere segments (width, height) for Earth and clouds */
export const EARTH_SEGMENTS: Record<QualityLevel, number> = {
  low: 24,
  medium: 48,
  high: 64,
};

/** Moon sphere segments */
export const MOON_SEGMENTS: Record<QualityLevel, number> = {
  low: 16,
  medium: 24,
  high: 32,
};

/** 2D map canvas size [width, height] and night overlay step */
export const MAP_SIZE: Record<QualityLevel, { width: number; height: number; nightStep: number }> = {
  low: { width: 360, height: 180, nightStep: 6 },
  medium: { width: 720, height: 360, nightStep: 4 },
  high: { width: 1600, height: 1000, nightStep: 3 },
};

/** 2D map background texture JPG – resolution matches quality (standard vs 8k). */
export const MAP_TEXTURE: Record<QualityLevel, string> = {
  low: "/textures/earth.jpg",
  medium: "/textures/earth.jpg",
  high: "/textures/earth8k.jpg",
};

interface QualityState {
  level: QualityLevel;
  setLevel: (level: QualityLevel) => void;
}

export const useQuality = create<QualityState>()(
  persist(
    (set) => ({
      level: "medium",
      setLevel: (level) => set({ level }),
    }),
    { name: "satellite-tracking-quality" }
  )
);
