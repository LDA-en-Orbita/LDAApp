import { ScreenLayout } from '@/src/components/ScreenLayout';
import { ScreenTitles } from '@/src/constants/Routes';
import { SolarSystemScreen } from '@/src/views/SolarSystemScreen';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function SolarSystemPage() {
  const router = useRouter();
  
  return (
    <ScreenLayout statusBarStyle="light">
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: ScreenTitles.SOLAR_SYSTEM,
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <SolarSystemScreen navigation={router} />
    </ScreenLayout>
  );
}