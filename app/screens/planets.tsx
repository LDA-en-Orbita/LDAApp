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
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <PlanetScreen />
    </ScreenLayout>
  );
}
