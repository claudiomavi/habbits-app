import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'

export function GradientBackground({ children, style, edges = ['top', 'bottom'] }) {
 return (
   <LinearGradient
     colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
     start={{ x: 0, y: 0 }}
     end={{ x: 1, y: 1 }}
     style={[{ flex: 1 }, style]}
   >
     <SafeAreaView style={{ flex: 1 }} edges={edges}>
       {children}
     </SafeAreaView>
   </LinearGradient>
 )
}
