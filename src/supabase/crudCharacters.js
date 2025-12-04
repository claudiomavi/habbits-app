import { supabase } from '../autoBarrell'

// Table: characters
// Suggested schema:
// id (uuid) PK default uuid_generate_v4()
// key (text) unique not null
// name (text) not null
// gender (text) null (e.g., 'male' | 'female' | 'neutral')
// active (bool) default true
// variants (jsonb) [{ level_from: number, image_url: string }]
// created_at (timestamptz) default now()

export async function getCharacters() {
	const { data, error } = await supabase
		.from('characters')
		.select('*')
		.eq('active', true)
		.order('created_at', { ascending: true })
	if (error) throw error
	return data || []
}

const __charCache = new Map()
export async function getCharacterById(id) {
	const hit = __charCache.get(id)
	const now = Date.now()
	if (hit && now - hit.ts < 60000) return hit.data
	const { data, error } = await supabase
		.from('characters')
		.select('*')
		.eq('id', id)
		.maybeSingle()
	if (error) throw error
	return data
}

export function getImageForLevel(character, level = 1) {
	if (!character) return null
	const variants = Array.isArray(character.variants) ? character.variants : []
	if (!variants.length) return character.image_url || null
	// choose the highest level_from <= level
	const eligible = variants
		.filter((v) => typeof v.level_from === 'number' && v.image_url)
		.sort((a, b) => (b.level_from || 0) - (a.level_from || 0))
	for (const v of eligible) {
		if (level >= v.level_from) return v.image_url
	}
	// fallback to the lowest or the first
	return eligible[eligible.length - 1]?.image_url || character.image_url || null
}

export async function upsertCharacter(character) {
	// character: { id?, key, name, gender, active?, variants? }
	const { data, error } = await supabase
		.from('characters')
		.upsert(character)
		.select()
		.single()
	if (error) throw error
	return data
}

export async function deleteCharacter(id) {
	const { error } = await supabase.from('characters').delete().eq('id', id)
	if (error) throw error
}
