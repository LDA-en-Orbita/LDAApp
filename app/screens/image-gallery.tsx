import { ScreenLayout } from '@/src/components/ScreenLayout';
import ImageGalleryScreen from '@/src/views/screens/ImageGalleryScreen';
import { Stack } from 'expo-router';
import React from 'react';

export default function ImageGalleryPage() {
  return (
    <ScreenLayout statusBarStyle="light">
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <ImageGalleryScreen />
    </ScreenLayout>
  );
}