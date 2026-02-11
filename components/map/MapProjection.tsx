"use client";

import { useRef, useEffect } from "react";
import { getSubsolarLatLon } from "@/lib/sun";
import { getLatLon } from "@/lib/satellite";
import { useSimTime } from "@/store/simTime";
import { useQuality, MAP_SIZE, MAP_TEXTURE } from "@/store/quality";

const TLE1 = "1 25544U 98067A   23042.51809028  .00012544  00000+0  24459-3 0  9993";
const TLE2 = "2 25544  51.6430 175.1745 0008488  89.5512  46.2820 15.50015568399915";

const ORBIT_STEPS = 20;
const STEP_MINUTES = 6;

function latLonToXY(lat: number, lon: number, width: number, height: number): [number, number] {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

function isNight(
  latDeg: number,
  lonDeg: number,
  subsolarLat: number,
  subsolarLon: number
): boolean {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const lat = toRad(latDeg);
  const lon = toRad(lonDeg);
  const latSs = toRad(subsolarLat);
  const lonSs = toRad(subsolarLon);
  const dot =
    Math.sin(lat) * Math.sin(latSs) +
    Math.cos(lat) * Math.cos(latSs) * Math.cos(lon - lonSs);
  return dot < 0;
}

interface MapProjectionProps {
  fullScreen?: boolean;
}

export default function MapProjection({ fullScreen = false }: MapProjectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const quality = useQuality((s) => s.level);
  const mapConfig = MAP_SIZE[quality];
  const textureUrl = MAP_TEXTURE[quality];

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = textureUrl;
    img.onload = () => {
      imageRef.current = img;
    };
    return () => {
      imageRef.current = null;
    };
  }, [textureUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width: W, height: H, nightStep: step } = mapConfig;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const now = useSimTime.getState().time;
      const img = imageRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (img?.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, w, h);
      } else {
        ctx.fillStyle = "#1a3a52";
        ctx.fillRect(0, 0, w, h);
      }

      const { lat: subsolarLat, lon: subsolarLon } = getSubsolarLatLon(now);
      const nightAlpha = 0.65;
      ctx.fillStyle = `rgba(10, 15, 35, ${nightAlpha})`;
      for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
          const lat = 90 - (py / h) * 180;
          const lon = (px / w) * 360 - 180;
          if (isNight(lat, lon, subsolarLat, subsolarLon)) {
            ctx.fillRect(px, py, step + 1, step + 1);
          }
        }
      }

      const orbitPoints: [number, number][] = [];
      for (let i = 0; i < ORBIT_STEPS; i++) {
        const t = new Date(now.getTime() + i * STEP_MINUTES * 60 * 1000);
        const pos = getLatLon(TLE1, TLE2, t);
        if (pos) orbitPoints.push(latLonToXY(pos.lat, pos.lon, w, h));
      }

      if (orbitPoints.length > 1) {
        ctx.strokeStyle = "rgba(0, 255, 255, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(orbitPoints[0][0], orbitPoints[0][1]);

        for (let i = 1; i < orbitPoints.length; i++) {
          const [prevX] = orbitPoints[i - 1];
          const [x, y] = orbitPoints[i];
          const dx = Math.abs(x - prevX);
          if (dx > w * 0.5) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      const satPos = getLatLon(TLE1, TLE2, now);
      if (satPos) {
        const [sx, sy] = latLonToXY(satPos.lat, satPos.lon, w, h);
        ctx.fillStyle = "#00ffff";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(2, 4 * (w / 720)), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    };

    draw();
    const raf = requestAnimationFrame(function loop() {
      draw();
      requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [quality, mapConfig.width, mapConfig.height, mapConfig.nightStep]);

  return (
    <div
      className={`overflow-hidden border border-white/20 shadow-xl bg-black/40 backdrop-blur-sm ${
        fullScreen
          ? "absolute inset-0 rounded-none flex items-center justify-center"
          : "absolute bottom-6 right-6 rounded-lg max-w-[200px] max-h-[120px]"
      }`}
      style={
        fullScreen
          ? {}
          : {
              width: mapConfig.width,
              height: mapConfig.height,
              transform: "scale(2)",
              transformOrigin: "bottom right",
            }
      }
    >
      {fullScreen ? (
        <div
          className="w-full h-full max-w-full max-h-full flex items-center justify-center"
          style={{ aspectRatio: "2/1", maxHeight: "100%" }}
        >
          <canvas
            ref={canvasRef}
            width={mapConfig.width}
            height={mapConfig.height}
            className="w-full h-full block"
            style={{ imageRendering: "crisp-edges" }}
          />
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={mapConfig.width}
          height={mapConfig.height}
          className="block w-full h-full"
          style={{ imageRendering: "crisp-edges" }}
        />
      )}
    </div>
  );
}
