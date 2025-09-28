import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface NASAMissionsScreenProps {
  navigation: any;
}

export const NASAMissionsScreen: React.FC<NASAMissionsScreenProps> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[Colors.background.start, Colors.background.middle]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>🚀</Text>
        <Text style={styles.title}>Misiones NASA</Text>
        <Text style={styles.description}>
          Explora las increíbles misiones espaciales de la NASA, desde rovers en Marte hasta telescopios que observan galaxias lejanas.
        </Text>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver al Menú</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: Colors.button.background,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.button.border,
  },
  backButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});