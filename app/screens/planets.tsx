import { ScreenLayout } from '@/src/components/ScreenLayout';
import { ScreenTitles } from '@/src/constants/Routes';
import PlanetScreen from '@/src/views/screens/PlanetScreen';
import { Stack } from 'expo-router';
import React from 'react';

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
          headerBlurEffect: 'dark', // Efecto blur en iOS
        }} 
      />
      <PlanetScreen />
    </ScreenLayout>
  );
}
