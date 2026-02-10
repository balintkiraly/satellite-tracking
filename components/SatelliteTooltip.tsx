import { useState } from "react";

export default function SatelliteTooltip({ screenPos, visible }) {
  if (!visible) return null;

  return (
    <div
      className="absolute bg-black/70 text-white p-2 rounded-md text-sm pointer-events-none"
      style={{
        left: screenPos.x,
        top: screenPos.y,
        transform: "translate(-50%, -120%)",
      }}
    >
      <p>Name: ISS</p>
      <p>Altitude: 420 km</p>
      <p>Speed: 7.66 km/s</p>
    </div>
  );
}
