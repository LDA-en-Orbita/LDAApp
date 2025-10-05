import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { PlanetData } from '../../models/PlanetModel';
import PlanetService from '../../services/PlanetService';

const { width } = Dimensions.get('window');

// Mapeo de imágenes de planetas
const planetImages: { [key: string]: string } = {
  'Mercury': 'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png',
  'Venus': 'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png',
  'Earth': 'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png',
  'Mars': 'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png',
  'Jupiter': 'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png',
  'Saturn': 'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png',
  'Uranus': 'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png',
  'Neptune': 'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png',
  'Pluto':'https://i.postimg.cc/8C0z8Sb5/316503695-11383066.png',
};

const PlanetScreen: React.FC = () => {
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch de datos desde la API usando el servicio
  const fetchPlanets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar el servicio de planetas
      const planetsData = await PlanetService.getAllPlanets();
      setPlanets(planetsData);
      
    } catch (err) {
      // El servicio ya hace el logging detallado
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error de conexión: ${errorMessage}`);
      Alert.alert(
        'Error de Conexión', 
        `No se pudieron cargar los datos de los planetas.\n\nDetalle: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  return (
    <ImageBackground style={styles.container}>
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
          keyExtractor={(item, index) => item.command || index.toString()}
          snapToInterval={width * 0.85 + 20}
          snapToAlignment="center"
          decelerationRate="fast"
          style={{ marginTop: 50 }}
          contentContainerStyle={{
            paddingHorizontal: (width - (width * 0.95)) / 2,
            alignItems: 'flex-start',
            gap: 20,
          }}
          renderItem={({ item, index }) => (
            <View style={styles.cardWrapper}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: planetImages[item.target_name] || planetImages['Earth'] }}
                  style={styles.planetImage}
                  contentFit="cover"
                />
              </View>

              {/* Fondo en la tarjeta */}
              <ImageBackground
                style={styles.planetContainer}
                imageStyle={{ borderRadius: 20, opacity: 0.9 }}
              >
                <Text style={styles.planetName}>
                  {item.target_name_es || item.target_name}
                </Text>
                <Text style={styles.command}>Command: {item.command}</Text>
                <Text style={styles.attributesTitle}>Atributos:</Text>

                {item.attributes.slice(0, 6).map((attr, attrIndex) => (
                  <View key={`${index}-${attrIndex}`} style={styles.attributeItem}>
                    <Text style={styles.attributeName}>{attr.name.es}</Text>
                    <Text style={styles.attributeValue}>
                      {attr.value} {attr.unit || ''}
                    </Text>
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
    justifyContent: 'flex-start', // Cambiado de 'center' a 'flex-start'
    alignItems: 'center',
    paddingTop: 0, // Añade padding superior si necesitas más espacio
    backgroundColor: '#1c1037',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.95,
    maxWidth: 800,
    paddingVertical: 10,
  },
  imageContainer: {
    alignItems: 'center',
    zIndex: 2,
  },
  planetImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#000',
  },
  planetContainer: {
    marginTop: -50,
    padding: 24,
    paddingTop: 60,
    width: '100%',
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
