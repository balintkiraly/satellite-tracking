import * as satellite from "satellite.js";

export function getLatLon(tle1: string, tle2: string, date: Date) {
  const satrec = satellite.twoline2satrec(tle1, tle2);
  const positionAndVelocity = satellite.propagate(satrec, date);
  if (!positionAndVelocity?.position) return null;
  const gmst = satellite.gstime(date);
  const positionGd = satellite.eciToGeodetic(
    positionAndVelocity.position,
    gmst,
  );
  return {
    lat: satellite.degreesLat(positionGd.latitude),
    lon: satellite.degreesLong(positionGd.longitude),
    alt: positionGd.height / 1000, // scale to “Earth radius units”
  };
}
