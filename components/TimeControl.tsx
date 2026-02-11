"use client";

import { useSimTime, ZoomLevel } from "@/lib/simTime";
import { useMemo } from "react";

export default function Timeline() {
  const {
    time,
    startTime,
    endTime,
    speed,
    playing,
    setTime,
    setSpeed,
    togglePlay,
    zoom,
    setZoom,
  } = useSimTime();

  const totalRange = endTime.getTime() - startTime.getTime();

  const sliderValue = useMemo(() => {
    return (time.getTime() - startTime.getTime()) / totalRange;
  }, [time, startTime, totalRange]);

  const handleSliderChange = (value: number) => {
    const newTime = new Date(startTime.getTime() + value * totalRange);
    setTime(newTime);
  };

  // Slider marks (HH:MM)
  const marks = useMemo(() => {
    const steps = 5; // 5 markers
    const arr = [];
    for (let i = 0; i <= steps; i++) {
      const t = new Date(startTime.getTime() + (i / steps) * totalRange);
      arr.push(t.toUTCString().slice(17, 22)); // HH:MM
    }
    return arr;
  }, [startTime, totalRange]);

  return (
    <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md text-white p-5 rounded-xl w-[500px] space-y-3">
      
      {/* Zoom Buttons */}
      <div className="flex gap-2 mb-2">
        {(["1h", "24h", "7d"] as ZoomLevel[]).map((z) => (
          <button
            key={z}
            onClick={() => setZoom(z)}
            className={`px-3 py-1 rounded ${
              zoom === z ? "bg-white/30" : "bg-white/10"
            }`}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Current Time */}
      <div className="text-sm font-mono mb-1">
        {time.toUTCString()}
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={0}
          max={1}
          step={0.0001}
          value={sliderValue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full"
        />

        {/* Marks */}
        <div className="absolute top-5 left-0 w-full flex justify-between text-xs text-white/70 font-mono">
          {marks.map((m, idx) => (
            <span key={idx}>{m}</span>
          ))}
        </div>
      </div>

      {/* Play / Speed Controls */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={togglePlay}
          className="px-3 py-1 bg-white/20 rounded"
        >
          {playing ? "Pause" : "Play"}
        </button>

        {[1, 10, 100].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-3 py-1 rounded bg-white/20 ${
              speed === s ? "bg-white/40" : ""
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="text-xs opacity-70">Speed: {speed}x</div>
    </div>
  );
}
