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
