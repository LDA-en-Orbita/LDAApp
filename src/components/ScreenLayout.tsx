import { StatusBar } from 'expo-status-bar';
import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

interface ScreenLayoutProps {
  children: ReactNode;
  statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
  backgroundColor?: string;
}

/**
 * Componente de layout base para todas las pantallas de la aplicación
 * Proporciona una estructura consistente y manejo del StatusBar
 */
export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ 
  children, 
  statusBarStyle = 'light',
  backgroundColor = 'transparent' 
}) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={statusBarStyle} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});