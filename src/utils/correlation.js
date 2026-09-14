// Utility functions for correlation calculations
// SIH26143 — OceanGuard Marine Oil Spill Intelligence System

/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * @param {number} lat1 - Latitude 1
 * @param {number} lng1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lng2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculate distance-based correlation score
 * Vessels within 5 km get high scores, beyond 20 km get very low scores
 * @param {number} distanceKm
 * @returns {number} Score 0-100
 */
export function distanceScore(distanceKm) {
  if (distanceKm <= 2) return 95;
  if (distanceKm <= 5) return Math.round(95 - ((distanceKm - 2) / 3) * 20);
  if (distanceKm <= 10) return Math.round(75 - ((distanceKm - 5) / 5) * 30);
  if (distanceKm <= 20) return Math.round(45 - ((distanceKm - 10) / 10) * 30);
  return Math.max(5, Math.round(15 - ((distanceKm - 20) / 10) * 10));
}

/**
 * Calculate overall correlation score from individual factors
 * @param {object} factors
 * @returns {number} Overall score 0-100
 */
export function calculateOverallCorrelation(factors) {
  const weights = {
    distanceScore: 0.30,
    timeScore: 0.25,
    trackOverlap: 0.20,
    directionScore: 0.15,
    historicalProximity: 0.10,
  };
  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    total += (factors[key] || 0) * weight;
  }
  return Math.round(total);
}

/**
 * Find vessels near a spill location
 * @param {object} spill - Spill with lat/lng
 * @param {Array} vessels - List of all vessels
 * @param {number} radiusKm - Search radius in km
 * @returns {Array} Vessels sorted by correlation score
 */
export function findNearbyVessels(spill, vessels, radiusKm = 50) {
  return vessels
    .filter(v => spill.nearbyVessels?.includes(v.id))
    .map(vessel => {
      const dist = haversineDistance(spill.lat, spill.lng, vessel.lat, vessel.lng);
      return { ...vessel, calculatedDistance: dist };
    })
    .sort((a, b) => b.correlationScore - a.correlationScore);
}

/**
 * Get risk level label from score
 */
export function getRiskLevel(score) {
  if (score >= 80) return { label: 'HIGH RISK', color: 'text-red-400', bg: 'bg-red-500/20' };
  if (score >= 60) return { label: 'MODERATE', color: 'text-orange-400', bg: 'bg-orange-500/20' };
  if (score >= 40) return { label: 'LOW RISK', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  return { label: 'MINIMAL', color: 'text-green-400', bg: 'bg-green-500/20' };
}

/**
 * Get severity styles
 */
export function getSeverityStyle(severity) {
  switch (severity) {
    case 'CRITICAL': return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' };
    case 'HIGH': return { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50' };
    case 'MEDIUM': return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' };
    case 'LOW': return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' };
    default: return { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/50' };
  }
}

/**
 * Get alert type styles
 */
export function getAlertStyle(type) {
  switch (type) {
    case 'CRITICAL': return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40', dot: 'bg-red-500' };
    case 'WARNING': return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40', dot: 'bg-orange-500' };
    case 'INFO': return { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', dot: 'bg-cyan-500' };
    default: return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/40', dot: 'bg-gray-500' };
  }
}

/**
 * Format relative time from ISO string
 */
export function formatRelativeTime(isoString) {
  const now = new Date('2026-09-11T21:54:00+05:30');
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}

/**
 * Format ISO date to readable string
 */
export function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }) + ' IST';
}
