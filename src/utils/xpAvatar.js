// Reusable helpers to compute xp progress percent and avatar uri for a profile
// So screens can share logic without duplicating code.

export async function getAvatarUriForProfile(profile) {
  if (!profile) return null
  const level = profile?.level ?? 1
  const fallback = profile?.avatar?.uri || profile?.avatar || null
  try {
    if (!profile?.character_id) return fallback
    const { getCharacterById, getImageForLevel } = await import('../autoBarrell')
    const character = await getCharacterById(profile.character_id)
    return getImageForLevel(character, level) || fallback
  } catch {
    return fallback
  }
}

export function getXpPercentForProfile(profile) {
  if (!profile) return 0
  // If profile already stores level and xp, use computeLevel to derive current level boundaries
  // and compute percent within the current level.
  // We rely on computeLevel(totalXP) to infer thresholds: level grows roughly every N XP.
  // If thresholds aren’t exposed, we approximate using the fractional part around the current level.
  try {
    const total = Number(profile?.xp || 0)
    const { computeLevel } = require('../autoBarrell')
    const level = profile?.level ?? computeLevel(total)
    const prevLevel = Math.max(1, level - 1)
    const prevThreshold = xpThresholdForLevel(prevLevel)
    const currentThreshold = xpThresholdForLevel(level)
    const nextThreshold = xpThresholdForLevel(level + 1)
    const clamped = Math.max(currentThreshold, Math.min(total, nextThreshold))
    const span = Math.max(1, nextThreshold - currentThreshold)
    return (clamped - currentThreshold) / span
  } catch {
    return 0
  }
}

// Basic threshold model. If project has a canonical version, replace this with that logic.
function xpThresholdForLevel(level) {
  // Example: quadratic growth: L1=0, L2=100, L3=300, L4=600, ...
  const L = Math.max(1, Number(level) || 1)
  return ((L - 1) * L * 100) / 2
}
