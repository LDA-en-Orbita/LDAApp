// views/screens/ImageGalleryScreen.tsx
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import {
    ImageGalleryData,
    ImageItem,
    PlanetDisplayNames
} from '../../models/ImageGalleryModel';
import ImageGalleryService from '../../services/ImageGalleryService';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2; // 2 columnas con espaciado

const ImageGalleryScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Obtener parámetros de navegación
  const planetName = params.planetName as string || 'marte';
  const planetDisplayName = PlanetDisplayNames[planetName] || planetName;
  
  const [galleryData, setGalleryData] = useState<ImageGalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Estados para el modal
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Valores animados para zoom y pan
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Fetch de imágenes desde la API
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await ImageGalleryService.getImagesByPlanet(planetName);
      setGalleryData(data);
      
    } catch (err) {
      console.error('❌ [ImageGalleryScreen] Error al cargar imágenes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error de conexión: ${errorMessage}`);
      Alert.alert(
        'Error de Conexión', 
        `No se pudieron cargar las imágenes de ${planetDisplayName}.\n\nDetalle: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [planetName]);

  // Funciones para el modal
  const openModal = (image: ImageItem) => {
    setSelectedImage(image);
    setModalVisible(true);
    // Resetear valores de zoom y pan
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setSelectedImage(null);
      // Resetear valores de zoom y pan
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
    }, 300);
  };

  const showImageDetails = (image: ImageItem) => {
    Alert.alert(
      image.title,
      `NASA ID: ${image.nasaId}\n\nPalabras clave: ${image.keywords.join(', ')}\n\nFuente: ${image.source}`,
      [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Ver Original', onPress: () => console.log('Abrir imagen original:', image.url) }
      ]
    );
  };

  // Gestores de gestos para zoom y pan
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(5, event.scale));
    })
    .onEnd(() => {
      if (scale.value < 1.5) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      // Límites de pan basados en el scale
      const maxTranslateX = (width * (scale.value - 1)) / 2;
      const maxTranslateY = (height * (scale.value - 1)) / 2;
      
      translateX.value = withSpring(
        Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX.value))
      );
      translateY.value = withSpring(
        Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY.value))
      );
    });

  const composedGestures = Gesture.Simultaneous(pinchGesture, panGesture);

  // Estilos animados
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const renderImageItem = ({ item }: { item: ImageItem }) => (
    <TouchableOpacity 
      style={styles.imageContainer}
      onPress={() => openModal(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
        style={styles.imageOverlay}
      >
        <Text style={styles.imageTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.imageId}>ID: {item.nasaId}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFilterChip = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={[
        styles.filterChip, 
        selectedFilter === item && styles.filterChipActive
      ]}
      onPress={() => setSelectedFilter(item)}
    >
      <Text style={[
        styles.filterChipText,
        selectedFilter === item && styles.filterChipTextActive
      ]}>
        {item.replace(/_/g, ' ').replace(/mars |marte /gi, '')}
      </Text>
    </TouchableOpacity>
  );

  const getFilteredImages = (): ImageItem[] => {
    if (!galleryData) return [];
    
    if (selectedFilter === 'all') {
      return galleryData.items;
    }
    
    return galleryData.items.filter(image =>
      image.keywords.some(keyword =>
        selectedFilter.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '_'))
      )
    );
  };

  return (
    <ImageBackground 
      source={require('../../../assets/images/background-c.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.3 }}
    >
      <LinearGradient
        colors={['rgba(10, 14, 39, 0.9)', '#0A0E27']}
        style={styles.gradientOverlay}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Galería de Imágenes</Text>
          <Text style={styles.headerSubtitle}>{planetDisplayName}</Text>
        </View>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Cargando imágenes de {planetDisplayName}...</Text>
        </View>
      )}

      {/* Content */}
      {!loading && galleryData && (
        <>
          {/* Estadísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{galleryData.totalItems}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{galleryData.items.length}</Text>
              <Text style={styles.statLabel}>Mostradas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{galleryData.matchedGroupKeys.length}</Text>
              <Text style={styles.statLabel}>Misiones</Text>
            </View>
          </View>

          {/* Filtros */}
          {/* {galleryData.matchedGroupKeys.length > 0 && (
            <View style={styles.filtersSection}>
              <Text style={styles.filtersTitle}>Filtrar por misión:</Text>
              <FlatList
                data={['all', ...galleryData.matchedGroupKeys]}
                renderItem={renderFilterChip}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
              />
            </View>
          )} */}

          {/* Grid de imágenes */}
          <FlatList
            data={getFilteredImages()}
            renderItem={renderImageItem}
            keyExtractor={(item) => item.nasaId}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.gridRow}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🖼️</Text>
                <Text style={styles.emptyText}>
                  No se encontraron imágenes para este filtro
                </Text>
              </View>
            }
          />
        </>
      )}

      {/* Error State */}
      {!loading && !galleryData && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>❌</Text>
          <Text style={styles.emptyText}>
            No se pudieron cargar las imágenes de {planetDisplayName}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchImages}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para vista zoom de imagen */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <GestureHandlerRootView style={styles.gestureContainer}>
              <GestureDetector gesture={composedGestures}>
                <Animated.View style={[styles.imageZoomContainer, animatedStyle]}>
                  <Image
                    source={{ uri: selectedImage.url }}
                    style={styles.fullscreenImage}
                    contentFit="contain"
                  />
                </Animated.View>
              </GestureDetector>
            </GestureHandlerRootView>
          )}

          <View style={styles.modalFooter}>
            <Text style={styles.imageTitle} numberOfLines={2}>
              {selectedImage?.title || 'Imagen sin título'}
            </Text>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => selectedImage && showImageDetails(selectedImage)}
            >
              <Text style={styles.detailsButtonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#00d4ff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  filtersContainer: {
    paddingRight: 20,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipActive: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  filterChipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  imageTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  imageId: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos del modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageZoomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height * 0.7,
  },
  modalFooter: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalImageTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  detailsButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ImageGalleryScreen;