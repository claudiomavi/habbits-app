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
  try {
    const total = Math.max(0, Number(profile?.xp || 0))
    const { computeLevel } = require('../autoBarrell')
    const level = profile?.level ?? computeLevel(total)
    const start = levelStartThreshold(level)
    const end = levelEndThreshold(level)
    const span = Math.max(1, end - start)
    const clamped = Math.max(start, Math.min(total, end))
    return (clamped - start) / span
  } catch {
    return 0
  }
}

// Thresholds aligned with computeLevel in crudUsers.js:
// computeLevel(totalXP) = floor(sqrt(totalXP/100)) + 1
// Level L spans XP in [100*(L-1)^2, 100*L^2)
function levelStartThreshold(level) {
  const L = Math.max(1, Number(level) || 1)
  return 100 * (L - 1) * (L - 1)
}
function levelEndThreshold(level) {
  const L = Math.max(1, Number(level) || 1)
  return 100 * L * L
}
