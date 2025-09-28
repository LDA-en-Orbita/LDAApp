import { ScreenLayout } from '@/src/components/ScreenLayout';
import { ScreenTitles } from '@/src/constants/Routes';
import { NASAMissionsScreen } from '@/src/views/NASAMissionsScreen';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function NASAMissionsPage() {
  const router = useRouter();
  
  return (
    <ScreenLayout statusBarStyle="light">
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: ScreenTitles.NASA_MISSIONS,
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <NASAMissionsScreen navigation={router} />
    </ScreenLayout>
  );
}