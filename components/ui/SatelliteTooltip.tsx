import { Card } from "./Card";

export default function SatelliteTooltip({
  screenPos,
  visible,
}: {
  screenPos: { x: number; y: number };
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div
      className="absolute"
      style={{
        left: screenPos.x,
        top: screenPos.y,
        transform: "translate(-50%, -120%)",
      }}
    >
      <Card className="p-2 rounded-md text-sm pointer-events-none">
        <p>Name: ISS</p>
        <p>Altitude: 420 km</p>
        <p>Speed: 7.66 km/s</p>
      </Card>
    </div>
  );
}
