import { supabase } from '../autoBarrell'

export const getUserProfile = async (userId) => {
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single()
	if (error) throw error
	return data
}

export const createUserProfile = async ({ id, name, avatar }) => {
	const { data, error } = await supabase
		.from('profiles')
		.insert([{ id, name, avatar }])
		.single()
	if (error) throw error
	return data
}

export const updateUserProfile = async ({ id, name, avatar }) => {
	const { data, error } = await supabase
		.from('profiles')
		.update({ name, avatar })
		.eq('id', id)
		.single()
	if (error) throw error
	return data
}
