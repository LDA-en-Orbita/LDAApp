import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { LocalPlanetData } from '../../models/PlanetModel';

const { width } = Dimensions.get('window');
const backgroundUri = require('../../assets/space-bg.jpg'); 
const cardBackgroundUri = require('../../assets/card-bg.jpg'); 
const localPlanetsData: LocalPlanetData[] = [
  {
    id: '1',
    command: '399',
    target_name: 'Earth',
    attributes: [
      {
        key: 'mean_radius_km',
        name: { es: 'Radio medio (km)', en: 'Mean Radius (km)' },
        value: '6371.01',
      },
      {
        key: 'mass_x10_24_kg',
        name: { es: 'Masa ×10^24 (kg)', en: 'Mass ×10^24 (kg)' },
        value: '5.97219',
      },
    ],
  },
];

const PlanetScreen: React.FC = () => {
  const [planets, setPlanets] = useState<LocalPlanetData[]>(localPlanetsData);
  const [loading, setLoading] = useState(false);

  return (
    <ImageBackground source={backgroundUri} style={styles.container}>
      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: 'white' }}>Loading planet data...</Text>
        </View>
      )}

      {/* Carrusel */}
      {!loading && planets.length > 0 && (
        <FlatList
          data={planets}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          snapToInterval={width * 0.85 + 20}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: (width - (width * 0.85)) / 2,
            alignItems: 'center',
            gap: 20,
          }}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: 'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png' }}
                  style={styles.planetImage}
                  resizeMode="cover"
                />
              </View>

              {/* Fondo en la tarjeta */}
              <ImageBackground
                source={cardBackgroundUri}
                style={styles.planetContainer}
                imageStyle={{ borderRadius: 20, opacity: 0.9 }}
              >
                <Text style={styles.planetName}>{item.target_name}</Text>
                <Text style={styles.command}>Command: {item.command}</Text>
                <Text style={styles.attributesTitle}>Attributes:</Text>

                {item.attributes.map(attr => (
                  <View key={attr.key} style={styles.attributeItem}>
                    <Text style={styles.attributeName}>{attr.name.en}</Text>
                    <Text style={styles.attributeValue}>{attr.value}</Text>
                  </View>
                ))}
              </ImageBackground>
            </View>
          )}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.85,
    paddingVertical: 20,
  },
  imageContainer: {
    position: 'absolute',
    top: -50,
    alignItems: 'center',
    zIndex: 2,
  },
  planetImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#000',
  },
  planetContainer: {
    padding: 24,
    paddingTop: 80,
    width: '100%',
    minHeight: 420,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  planetName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  command: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 16,
  },
  attributesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  attributeItem: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  attributeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#eee',
  },
  attributeValue: {
    fontSize: 16,
    color: '#00d4ff',
  },
});

export default PlanetScreen;
