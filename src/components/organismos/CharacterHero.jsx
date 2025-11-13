import React from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { AvatarInitials } from '../../autoBarrell'

// CharacterHero: muestra el personaje centrado y evolucionado según el nivel
// Props:
// - characterId?: uuid del personaje
// - level: número de nivel actual
// - fallbackUri?: string (opcional)
// - initial?: string (para AvatarInitials si no hay imagen)
// - size?: number (tamaño del lado mayor)
export function CharacterHero({ characterId, level = 1, fallbackUri = null, initial = '', size = 240 }) {
  const [uri, setUri] = React.useState(fallbackUri)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!characterId) {
          if (mounted) setUri(fallbackUri || null)
          return
        }
        const { getCharacterById, getImageForLevel } = await import('../../autoBarrell')
        const character = await getCharacterById(characterId)
        const evolved = getImageForLevel(character, level) || fallbackUri || null
        if (mounted) setUri(evolved)
      } catch (e) {
        console.warn('CharacterHero load', e)
        if (mounted) setUri(fallbackUri || null)
      }
    })()
    return () => { mounted = false }
  }, [characterId, level, fallbackUri])

  return (
    <View style={[styles.container, { height: size, alignItems: 'center', justifyContent: 'center' }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { width: size, height: size }]} resizeMode="contain" />
      ) : (
        <AvatarInitials text={initial} size={Math.min(size, 160)} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  image: {
    borderRadius: 24,
  },
})
