import { ScreenLayout } from '@/src/components/ScreenLayout';
import { ScreenTitles } from '@/src/constants/Routes';
import PlanetScreen from '@/src/views/screens/PlanetScreen';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState('ES');

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ES' ? 'EN' : 'ES';
    setCurrentLanguage(newLanguage);
    
    Alert.alert(
      'Idioma cambiado',
      `Idioma seleccionado: ${newLanguage === 'ES' ? 'Español' : 'English'}`,
      [{ text: 'OK' }]
    );
    
    // Aquí puedes agregar la lógica para cambiar el idioma de la app
    console.log('Language changed to:', newLanguage);
  };

  return (
    <TouchableOpacity 
      style={styles.languageSelector}
      onPress={toggleLanguage}
    >
      <Text style={styles.languageText}>🌐</Text>
      <Text style={styles.languageCode}>{currentLanguage}</Text>
    </TouchableOpacity>
  );
};

export default function PlanetsPage() {
  return (
    <ScreenLayout statusBarStyle="light">
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: ScreenTitles.PLANETS,
          headerTransparent: true,
          headerStyle: { 
            backgroundColor: 'transparent',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: { 
            fontWeight: 'bold',
            color: '#ffffff'
          },
          headerBlurEffect: 'dark',
          headerRight: () => <LanguageSelector />,
        }} 
      />
      <PlanetScreen />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 60,
    justifyContent: 'center',
  },
  languageText: {
    fontSize: 16,
    marginRight: 4,
  },
  languageCode: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
