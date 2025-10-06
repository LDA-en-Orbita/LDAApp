import { ScreenLayout } from '@/src/components/ScreenLayout';
import MissionDetailsScreen from '@/src/views/screens/MissionDetailsScreen';
import { Stack } from 'expo-router';
import React from 'react';

export default function MissionDetailsPage() {
  return (
    <ScreenLayout statusBarStyle="light">
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <MissionDetailsScreen />
    </ScreenLayout>
  );
}