import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { MenuButton } from '../components/MenuButton';
import { Colors } from '../constants/Colors';
import { useWelcomeViewModel } from '../viewmodels/WelcomeViewModel';

const { height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { menuOptions, isLoading, handleNavigation } = useWelcomeViewModel();

  return (
    <LinearGradient
      colors={[Colors.background.start, Colors.background.middle, Colors.background.end]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>🌌</Text>
            </View>
          </View>
          
          <Text style={styles.title}>SpaceExplorer</Text>
          <Text style={styles.subtitle}>
            Descubre planetas y eventos{'\n'}astronómicos visibles desde Perú
          </Text>
        </View>

        {/* Menú de opciones */}
        <View style={styles.menuContainer}>
          {menuOptions.map((option) => (
            <MenuButton
              key={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onPress={() => handleNavigation(option.route, navigation)}
              isLoading={isLoading}
            />
          ))}
        </View>

        {/* Elementos decorativos */}
        <View style={styles.decorativeElements}>
          <Text style={styles.star}>✨</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>🌟</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  menuContainer: {
    alignItems: 'center',
    width: '100%',
  },
  decorativeElements: {
    position: 'absolute',
    top: 100,
    right: 30,
  },
  star: {
    fontSize: 20,
    marginVertical: 10,
    opacity: 0.6,
  },
});