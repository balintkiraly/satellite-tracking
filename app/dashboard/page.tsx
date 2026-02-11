"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import Earth from "@/components/earth/Earth";
import Satellite from "@/components/satellites/Satellite";
import OrbitPath from "@/components/satellites/OrbitPath";
import GroundStationCone from "@/components/ground_stations/GroundStation";
import NoisyStars from "@/components/environment/NoisyStars";
import Sun from "@/components/environment/Sun";
import Moon from "@/components/environment/Moon";
import SatelliteTooltip from "@/components/ui/SatelliteTooltip";
import MilkyWay from "@/components/environment/MilkyWay";
import { SimulationClock } from "@/components/simulations/SimulationClock";
import CameraIntro from "@/components/camera/CameraIntro";
import MapProjection from "@/components/map/MapProjection";
import TimeControls from "@/components/ui/TimeControl";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { QualitySelector } from "@/components/ui/QualitySelector";

const INTRO_START_ANGLE = 0.92;
const INTRO_START_RADIUS = 108;

export type ViewMode = "3d" | "2d";

export default function DashboardPage() {
  const [screenPos, setScreenPos] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("3d");

  const initialCameraPosition: [number, number, number] = [
    Math.sin(INTRO_START_ANGLE) * INTRO_START_RADIUS,
    0,
    Math.cos(INTRO_START_ANGLE) * INTRO_START_RADIUS,
  ];

  return (
    <div className="relative w-full h-screen">

      {viewMode === "3d" && (
        <Canvas camera={{ position: initialCameraPosition, fov: 55 }}>
          <CameraIntro onComplete={() => setIntroComplete(true)} delay={1} />
          <SimulationClock />
          <Stats />
          <Sun />
          <Moon earthPosition={[0, 0, 0]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <MilkyWay />
          <NoisyStars />
          <GroundStationCone lat={46.5} lon={19.1} satelliteAlt={0.4} />
          <Earth />
          <Satellite
            setScreenPos={setScreenPos}
            toggleTooltip={() => setTooltipVisible(!tooltipVisible)}
          />
          <OrbitPath />

          <OrbitControls enabled={introComplete} />
          <directionalLight position={[50, 50, 50]} intensity={1} />
        </Canvas>
      )}

      {viewMode === "2d" && <MapProjection fullScreen />}
      {/* viewMode === "3d" && <MapProjection /> */}

      <QualitySelector />
      <TimeControls />
      <SatelliteTooltip screenPos={screenPos} visible={tooltipVisible} />
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
}
