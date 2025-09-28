import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';

interface MenuButtonProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  isLoading?: boolean;
}

const { width } = Dimensions.get('window');

export const MenuButton: React.FC<MenuButtonProps> = ({
  title,
  description,
  icon,
  onPress,
  isLoading = false
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.buttonPressed]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: width * 0.85,
    backgroundColor: Colors.button.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.button.border,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonPressed: {
    backgroundColor: Colors.button.pressed,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});