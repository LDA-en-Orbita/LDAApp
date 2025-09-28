import { ScreenLayout } from '@/src/components/ScreenLayout';
import { ScreenTitles } from '@/src/constants/Routes';
import { EventsPeruScreen } from '@/src/views/EventsPeruScreen';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function EventsPeruPage() {
  const router = useRouter();
  
  return (
    <ScreenLayout statusBarStyle="light">
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: ScreenTitles.EVENTS_PERU,
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <EventsPeruScreen navigation={router} />
    </ScreenLayout>
  );
}