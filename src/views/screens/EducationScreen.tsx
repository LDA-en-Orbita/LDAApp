// views/screens/EducationScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    DifficultyColors,
    EducationContent,
    PlanetCodeMap,
    TypeColors
} from '../../models/EducationModel';
import EducationService from '../../services/EducationService';

const { width } = Dimensions.get('window');

const EducationScreen: React.FC = () => {
  const [educationContent, setEducationContent] = useState<EducationContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch de datos desde la API usando el servicio
  const fetchEducationContent = async (resetData: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentCursor = resetData ? 0 : cursor;
      const data = await EducationService.getEducationContent(currentCursor, 10);
      
      if (resetData) {
        setEducationContent(data.data);
      } else {
        setEducationContent(prev => [...prev, ...data.data]);
      }
      
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
      
    } catch (err) {
      console.error('❌ [EducationScreen] Error al cargar contenido educativo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error de conexión: ${errorMessage}`);
      Alert.alert(
        'Error de Conexión', 
        `No se pudo cargar el contenido educativo.\n\nDetalle: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationContent(true);
  }, []);

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return difficulty;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'guide': return 'Guía';
      case 'interactive': return 'Interactivo';
      default: return type;
    }
  };

  const renderEducationCard = ({ item }: { item: EducationContent }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      {/* Header de la tarjeta */}
      <View style={styles.cardHeader}>
        <View style={[styles.typeTag, { backgroundColor: TypeColors[item.type] }]}>
          <Text style={styles.typeText}>{getTypeText(item.type).toUpperCase()}</Text>
        </View>
        <View style={styles.planetInfo}>
          <Text style={styles.planetName}>🪐 {PlanetCodeMap[item.planet_code] || 'Unknown'}</Text>
        </View>
      </View>

      {/* Título y descripción */}
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>

      {/* Información adicional */}
      <View style={styles.cardFooter}>
        <View style={[styles.difficultyTag, { backgroundColor: DifficultyColors[item.difficulty] }]}>
          <Text style={styles.difficultyText}>{getDifficultyText(item.difficulty)}</Text>
        </View>
        <Text style={styles.duration}>⏱️ {item.duration_minutes} min</Text>
      </View>

      {/* Puntos clave (si existen) */}
      {item.key_points && item.key_points.length > 0 && (
        <View style={styles.keyPointsSection}>
          <Text style={styles.keyPointsTitle}>Puntos clave:</Text>
          {item.key_points.slice(0, 2).map((point, index) => (
            <Text key={index} style={styles.keyPoint}>• {point}</Text>
          ))}
          {item.key_points.length > 2 && (
            <Text style={styles.morePoints}>+{item.key_points.length - 2} más...</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchEducationContent(false);
    }
  };

  const onRefresh = () => {
    setCursor(0);
    fetchEducationContent(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Misiones NASA</Text>
        <Text style={styles.headerSubtitle}>Explorando nuestro sistema solar</Text>
      </View>

      {/* Loading inicial */}
      {loading && educationContent.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Cargando contenido educativo...</Text>
        </View>
      )}

      {/* Lista de contenido */}
      {!loading || educationContent.length > 0 ? (
        <FlatList
          data={educationContent}
          renderItem={renderEducationCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          refreshing={loading && educationContent.length > 0}
          onRefresh={onRefresh}
          ListFooterComponent={
            loading && hasMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#00d4ff" />
              </View>
            ) : null
          }
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50', // Verde como en tu imagen
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planetInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  planetName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '500',
  },
  keyPointsSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  keyPointsTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  keyPoint: {
    color: '#ffffff',
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 18,
    marginBottom: 4,
  },
  morePoints: {
    color: '#00d4ff',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default EducationScreen;