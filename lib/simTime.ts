import { create } from "zustand";

export type ZoomLevel = "1h" | "24h" | "7d";

interface SimTimeState {
  time: Date;          // Current simulation time
  speed: number;       // Simulation speed multiplier
  playing: boolean;    // Play/pause
  zoom: ZoomLevel;     // Timeline zoom level
  startTime: Date;     // Start of visible timeline
  endTime: Date;       // End of visible timeline

  // Actions
  setTime: (date: Date) => void;
  setSpeed: (speed: number) => void;
  togglePlay: () => void;
  setZoom: (zoom: ZoomLevel) => void;
  tick: (delta: number) => void; // advance simulation
}

export const useSimTime = create<SimTimeState>((set, get) => {
  const now = new Date();

  // Helper to compute timeline window based on zoom
  const computeWindow = (zoom: ZoomLevel) => {
    let totalMs = 24 * 3600 * 1000; // default 24h
    switch (zoom) {
      case "1h":
        totalMs = 1 * 3600 * 1000;
        break;
      case "24h":
        totalMs = 24 * 3600 * 1000;
        break;
      case "7d":
        totalMs = 7 * 24 * 3600 * 1000;
        break;
    }
    return {
      startTime: new Date(now.getTime() - totalMs / 2),
      endTime: new Date(now.getTime() + totalMs / 2),
    };
  };

  const initialWindow = computeWindow("24h");

  return {
    time: now,
    speed: 1,
    playing: true,
    zoom: "24h",
    startTime: initialWindow.startTime,
    endTime: initialWindow.endTime,

    setTime: (date) => set({ time: date }),
    setSpeed: (speed) => set({ speed }),
    togglePlay: () => set((s) => ({ playing: !s.playing })),
    setZoom: (zoom: ZoomLevel) => {
      const { startTime, endTime } = computeWindow(zoom);
      set({ zoom, startTime, endTime });
    },

    tick: (delta) => {
      const { playing, speed, time } = get();
      if (!playing) return;
      const newTime = new Date(time.getTime() + delta * 1000 * speed);
      set({ time: newTime });
    },
  };
});
