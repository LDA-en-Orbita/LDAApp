import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { PlanetData } from '../../models/PlanetModel';
import PlanetService from '../../services/PlanetService';

const { width, height } = Dimensions.get('window');

// Descripción de los planetas
const planetDescriptions: { [key: string]: string } = {
  'Mercury': 'El planeta más pequeño del Sistema Solar y el más cercano al Sol.',
  'Venus': 'El planeta más caliente del Sistema Solar, conocido por su atmósfera densa.',
  'Earth': 'El tercer planeta del Sistema Solar y el único conocido que alberga vida.',
  'Mars': 'El planeta rojo, conocido por su color característico debido al óxido de hierro.',
  'Jupiter': 'El planeta más grande del Sistema Solar, un gigante gaseoso.',
  'Saturn': 'Conocido por su impresionante sistema de anillos.',
  'Uranus': 'Un gigante de hielo con una rotación única.',
  'Neptune': 'El planeta más lejano del Sistema Solar, un gigante de hielo azul.',
  'Pluto': 'Un planeta enano en el cinturón de Kuiper.',
};

// Mapeo de imágenes de planetas
const planetImages: { [key: string]: any } = {
  'Mercury': require('../../../assets/images/planet/mercury.png'),
  'Venus': require('../../../assets/images/planet/venus.png'),
  'Earth': require('../../../assets/images/planet/earth.png'),
  'Mars': require('../../../assets/images/planet/mars-image.png'),
  'Jupiter': require('../../../assets/images/planet/jupiter.png'),
  'Saturn': require('../../../assets/images/planet/earth.png'), // Usar Earth como placeholder
  'Uranus': require('../../../assets/images/planet/earth.png'), // Usar Earth como placeholder
  'Neptune': require('../../../assets/images/planet/earth.png'), // Usar Earth como placeholder
  'Pluto': require('../../../assets/images/planet/earth.png'), // Usar Earth como placeholder
};

const PlanetScreen: React.FC = () => {
  const router = useRouter();
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlanets, setExpandedPlanets] = useState<{ [key: string]: boolean }>({});

  // Función para obtener la imagen del planeta
  const getPlanetImage = (planetName: string) => {
    console.log('🪐 [PlanetScreen] Buscando imagen para planeta:', planetName);
    const image = planetImages[planetName] || planetImages['Earth'];
    console.log('🖼️ [PlanetScreen] Imagen seleccionada:', image ? 'encontrada' : 'usando default');
    return image;
  };

  // Fetch de datos desde la API usando el servicio
  const fetchPlanets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar el servicio de planetas
      const planetsData = await PlanetService.getAllPlanets();
      setPlanets(planetsData);
      
    } catch (err) {
      console.error('❌ [PlanetScreen] Error al cargar planetas:', err);
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

  const toggleExpanded = (command: string) => {
    setExpandedPlanets(prev => ({
      ...prev,
      [command]: !prev[command]
    }));
  };

  return (
    <ImageBackground 
      source={require('../../../assets/images/background-c.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.6 }}
    >
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(28, 16, 55, 0.85)', 'rgba(28, 16, 55, 0.85)', '#0A0E27']}
        locations={[0, 0.5, 1]}
        style={styles.gradientOverlay}
      />

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: 'white' }}>Loading planet data...</Text>
        </View>
      )}

      {/* Carrusel */}
      {!loading && planets.length > 0 && (
        <View style={styles.carouselContainer}>
          <FlatList
            data={planets}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.command || index.toString()}
            snapToInterval={width}
            snapToAlignment="center"
            decelerationRate="fast"
            pagingEnabled

            renderItem={({ item, index }) => (
              <ScrollView style={styles.pageWrapper} showsVerticalScrollIndicator={false}>
                <View style={styles.cardWrapper}>
                  {/* Imagen del planeta */}
                  <View style={styles.imageContainer}>
                    <Image
                      source={getPlanetImage(item.target_name)}
                      style={styles.planetImage}
                      contentFit="contain"
                    />
                  </View>

                  {/* Nombre y descripción */}
                  <Text style={styles.planetName}>
                    {item.target_name_es || item.target_name}
                  </Text>
                  <Text style={styles.planetDescription}>
                    {planetDescriptions[item.target_name] || 'Un fascinante cuerpo celeste del Sistema Solar.'}
                  </Text>

                  {/* Tarjetas destacadas (primeros 4 atributos) */}
                  <View style={styles.highlightCardsContainer}>
                    {item.attributes.slice(0, 4).map((attr, attrIndex) => (
                      <View key={`highlight-${index}-${attrIndex}`} style={styles.highlightCard}>
                        <Text style={styles.highlightLabel}>{attr.name.es}</Text>
                        <Text style={styles.highlightValue}>
                          {attr.value} {attr.unit || ''}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Características Detalladas */}
                  <Text style={styles.detailsTitle}>Características Detalladas</Text>
                  <View style={styles.detailsContainer}>
                    {(() => {
                      const detailAttributes = item.attributes.slice(4);
                      const isExpanded = expandedPlanets[item.command] || false;
                      const visibleAttributes = isExpanded ? detailAttributes : detailAttributes.slice(0, 6);
                      const hasMoreItems = detailAttributes.length > 6;

                      return (
                        <>
                          {visibleAttributes.map((attr, attrIndex) => (
                            <View key={`detail-${index}-${attrIndex}`} style={styles.detailRow}>
                              <View style={styles.detailIconContainer}>
                                <View style={styles.detailIcon} />
                              </View>
                              <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>{attr.name.es}</Text>
                                <Text style={styles.detailValue}>
                                  {attr.value} {attr.unit || ''}
                                </Text>
                              </View>
                            </View>
                          ))}
                          
                          {hasMoreItems && (
                            <TouchableOpacity 
                              style={styles.viewMoreButton}
                              onPress={() => toggleExpanded(item.command)}
                            >
                              <Text style={styles.viewMoreText}>
                                {isExpanded ? '▲ Ver menos' : `▼ Ver más (${detailAttributes.length - 6} más)`}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </>
                      );
                    })()}
                  </View>

                  {/* Botones de acción */}
                  <View style={styles.actionButtons}>
<TouchableOpacity 
  style={styles.primaryButton}
  onPress={() => {
    router.push({
      pathname: '/screens/mission-details',
      params: {
        planetName: item.target_name,
        planetNameEs: item.target_name_es || item.target_name,
        planetCode: item.command
      }
    });
  }}
>
  <Text style={styles.primaryButtonText}>Ver Misiones 🚀</Text>
</TouchableOpacity>

<View style={styles.secondaryButtonsRow}>
<TouchableOpacity 
  style={[styles.secondaryButton, styles.secondaryButtonSmall]}
  onPress={() => {
    // Mapeo de nombres de planetas al formato de la API
    const planetNameMap: { [key: string]: string } = {
      'Mercury': 'mercurio',
      'Venus': 'venus', 
      'Earth': 'tierra',
      'Mars': 'marte',
      'Jupiter': 'jupiter',
      'Saturn': 'saturno',
      'Uranus': 'urano',
      'Neptune': 'neptuno',
      'Pluto': 'pluton'
    };
    
    router.push({
      pathname: '/screens/image-gallery',
      params: {
        planetName: planetNameMap[item.target_name] || item.target_name.toLowerCase(),
        planetDisplayName: item.target_name_es || item.target_name
      }
    });
  }}
>
  <Text style={styles.secondaryButtonText}>Galería 🖼️</Text>
</TouchableOpacity>

<TouchableOpacity 
  style={[styles.secondaryButton, styles.secondaryButtonSmall]}
  onPress={() => {
    router.push({
      pathname: '/screens/educational-content',
      params: {
        planetName: item.target_name,
        planetCode: item.command
      }
    });
  }}
>
  <Text style={styles.secondaryButtonText}>Educativo 📚</Text>
</TouchableOpacity>
</View>
                  </View>
                </View>
              </ScrollView>
            )}
          />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: '#0A0E27',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  carouselContainer: {
    flex: 1,
    marginTop: 80,
    width: '100%',
  },
  pageWrapper: {
    width: width,
    flex: 1,
  },
  cardWrapper: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  planetImage: {
    width: width * 0.65,
    height: width * 0.65,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editIcon: {
    fontSize: 24,
  },
  planetName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  planetDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    maxWidth: width - 48,
    paddingHorizontal: 0,
  },
  highlightCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: width - 48, // Ancho de pantalla menos padding horizontal
    marginBottom: 24,
    gap: 12,
  },
  highlightCard: {
    width: (width - 48 - 12) / 2, // Divide el espacio disponible entre 2, menos el gap
    backgroundColor: 'rgba(26, 50, 80, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  highlightLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  highlightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    width: width - 48,
  },
  detailsContainer: {
    width: width - 48,
    backgroundColor: 'rgba(10, 14, 39, 0.6)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailIconContainer: {
    marginRight: 12,
  },
  detailIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00d4ff',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  viewMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  viewMoreText: {
    color: '#3B9DC9',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 12,
    width: width - 48,
    marginTop: 8,
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3B9DC9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(59, 157, 201, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B9DC9',
  },
  secondaryButtonSmall: {
    flex: 0.5,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlanetScreen;
