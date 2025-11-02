export type Point = { x: number; y: number };

/**
 * Calculates the perpendicular distance from a point to a line segment
 */
function getPerpendicularDistance(
  point: Point,
  lineStart: Point,
  lineEnd: Point,
): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  if (dx === 0 && dy === 0) {
    return Math.hypot(point.x - lineStart.x, point.y - lineStart.y);
  }

  const t =
    ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) /
    (dx * dx + dy * dy);
  const nearestX = lineStart.x + t * dx;
  const nearestY = lineStart.y + t * dy;
  return Math.hypot(point.x - nearestX, point.y - nearestY);
}

/**
 * Ramer-Douglas-Peucker algorithm
 */
function rdp(points: Point[], epsilon: number): Point[] {
  if (points.length < 3) return points;

  let maxDist = 0;
  let index = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const dist = getPerpendicularDistance(
      points[i],
      points[0],
      points[points.length - 1],
    );
    if (dist > maxDist) {
      index = i;
      maxDist = dist;
    }
  }

  if (maxDist > epsilon) {
    const left = rdp(points.slice(0, index + 1), epsilon);
    const right = rdp(points.slice(index), epsilon);

    // Remove duplicate at join
    return [...left.slice(0, -1), ...right];
  } else {
    return [points[0], points[points.length - 1]];
  }
}

/**
 * Compress points array
 */
export function compressPoints(points: Point[], epsilon: number = 1): Point[] {
  return rdp(points, epsilon);
}

/**
 * Encodes an array of points into a compact base64-like string.
 * This uses delta encoding + variable-length quantity (VLQ) encoding.
 */
export function encodePoints(points: Point[]): string {
  let lastX = 0;
  let lastY = 0;
  let result = "";

  for (const p of points) {
    const x = Math.round(p.x * 1e5);
    const y = Math.round(p.y * 1e5);

    const dx = x - lastX;
    const dy = y - lastY;
    lastX = x;
    lastY = y;

    result += encodeSignedNumber(dx) + encodeSignedNumber(dy);
  }

  return result;
}

/**
 * Decodes the string back into an array of points.
 */
export function decodePoints(encoded: string): Point[] {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const points: Point[] = [];

  while (index < encoded.length) {
    const dx = decodeSignedNumber(encoded, index);
    index = dx.index;
    const dy = decodeSignedNumber(encoded, index);
    index = dy.index;

    lat += dx.value;
    lng += dy.value;

    points.push({ x: lat / 1e5, y: lng / 1e5 });
  }

  return points;
}

// ---------- Internal helpers ---------- //

function encodeSignedNumber(num: number): string {
  let sgnNum = num << 1;
  if (num < 0) sgnNum = ~sgnNum;
  return encodeNumber(sgnNum);
}

function encodeNumber(num: number): string {
  let encoded = "";
  while (num >= 0x20) {
    encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }
  encoded += String.fromCharCode(num + 63);
  return encoded;
}

function decodeSignedNumber(
  encoded: string,
  startIndex: number,
): { value: number; index: number } {
  let result = 0;
  let shift = 0;
  let index = startIndex;
  let b: number;

  do {
    b = encoded.charCodeAt(index++) - 63;
    result |= (b & 0x1f) << shift;
    shift += 5;
  } while (b >= 0x20);

  const delta = result & 1 ? ~(result >> 1) : result >> 1;
  return { value: delta, index };
}
