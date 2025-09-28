import { WelcomeScreen } from '@/src/views/WelcomeScreen';
import { useRouter } from 'expo-router';
import React from 'react';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <WelcomeScreen navigation={router} />
  );
}
