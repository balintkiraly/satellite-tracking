import { Vector3 } from "three";

// degrees → radians
const deg2rad = (deg: number) => (deg * Math.PI) / 180;

// Compute subsolar point (approx but accurate enough)
export function getSunDirectionUTC(date = new Date()) {
  const rad = Math.PI / 180;

  // Days since J2000
  const d =
    date.getTime() / 86400000 +
    2440587.5 -
    2451545.0;

  // Mean longitude
  const g = deg2rad((357.529 + 0.98560028 * d) % 360);
  const q = deg2rad((280.459 + 0.98564736 * d) % 360);

  // Ecliptic longitude
  const L = q + deg2rad(1.915) * Math.sin(g) + deg2rad(0.020) * Math.sin(2 * g);

  // Obliquity of Earth
  const e = deg2rad(23.439 - 0.00000036 * d);

  // Sun declination
  const decl = Math.asin(Math.sin(e) * Math.sin(L));

  // Greenwich Mean Sidereal Time
  const time =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;

  const gmst = deg2rad((280.16 + 360.9856235 * d) % 360);
  const lon = gmst + time * (Math.PI / 12);

  // Convert to direction vector
  const x = Math.cos(decl) * Math.cos(lon);
  const y = Math.sin(decl);
  const z = Math.cos(decl) * Math.sin(lon);

  return new Vector3(x, y, z).normalize();
}

/** Subsolar point (lat, lon) in degrees for day/night terminator on a 2D map. */
export function getSubsolarLatLon(date = new Date()) {
  const dir = getSunDirectionUTC(date);
  const latRad = Math.asin(dir.y);
  const lonRad = Math.atan2(dir.z, dir.x);
  return {
    lat: (latRad * 180) / Math.PI,
    lon: (lonRad * 180) / Math.PI,
  };
}

/** Earth rotation (radians) around Y for UTC-aligned globe so day/night matches sun. */
export function getEarthRotationUTC(date = new Date()) {
  const rad = Math.PI / 180;
  const d =
    date.getTime() / 86400000 +
    2440587.5 -
    2451545.0;
  const q = deg2rad((280.459 + 0.98564736 * d) % 360);
  const gmst = deg2rad((280.16 + 360.9856235 * d) % 360);
  const time =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;
  const lon = gmst + time * (Math.PI / 12);
  return lon;
}
