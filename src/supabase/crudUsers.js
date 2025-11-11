import { supabase } from '../autoBarrell'

// Insertar perfil
export const addProfile = async (data) => {
	const { data: profile, error } = await supabase
		.from('profiles')
		.insert(data)
		.select()
		.single()
	if (error) throw error
	return profile
}

// Buscar perfil por email
export async function getProfileByMail(email) {
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('email', email)
		.maybeSingle()

	if (error) throw error
	return data // puede ser null si no hay perfil
}

// Buscar perfil por ID de usuario
export const getProfileByUserId = async (userId) => {
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('user_id', userId)
		.maybeSingle()
	if (error) throw error
	return data
}

// Actualizar id_auth cuando el usuario hace login por primera vez
export async function updateIdAuth(email, id_auth) {
	const { error } = await supabase
		.from('profiles')
		.update({ id_auth })
		.eq('email', email)
		.is('id_auth', null)
	if (error) throw error
}

// XP/Level helpers
export async function getProfileById(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export function computeLevel(totalXP) {
  const safe = Math.max(0, totalXP || 0)
  return Math.floor(Math.sqrt(safe / 100)) + 1
}

export async function updateProfileXpAndLevel(userId, delta) {
  if (!delta) return null
  const current = await getProfileById(userId)
  const newXp = Math.max(0, (current?.xp || 0) + delta)
  const newLevel = computeLevel(newXp)
  const { data, error } = await supabase
    .from('profiles')
    .update({ xp: newXp, level: newLevel })
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
