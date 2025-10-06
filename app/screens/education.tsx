import { ScreenLayout } from '@/src/components/ScreenLayout';
import { ScreenTitles } from '@/src/constants/Routes';
import EducationScreen from '@/src/views/screens/EducationScreen';
import { Stack } from 'expo-router';
import React from 'react';

export default function EducationPage() {
  return (
    <ScreenLayout statusBarStyle="light">
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: ScreenTitles.EDUCATION || 'Contenido Educativo',
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
        }} 
      />
      <EducationScreen />
    </ScreenLayout>
  );
}