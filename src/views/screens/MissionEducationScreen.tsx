// views/screens/MissionEducationScreen.tsx
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
  MissionEducationContent,
  PlanetCodeMap,
  TypeColors
} from '../../models/MissionEducationModel';
import MissionEducationService from '../../services/MissionEducationService';

const { width } = Dimensions.get('window');

const MissionEducationScreen: React.FC = () => {
  const [missionContent, setMissionContent] = useState<MissionEducationContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Función para mostrar detalles completos de la misión
  const showMissionDetails = (mission: MissionEducationContent) => {
    const detailsText = `
🪐 ${PlanetCodeMap[mission.planet_code] || 'Desconocido'}
📝 ${mission.title}

📖 Descripción:
${mission.description}

${mission.key_points && mission.key_points.length > 0 ? `
🎯 Puntos clave:
${mission.key_points.map((point, index) => `${index + 1}. ${point}`).join('\n')}
` : ''}

${mission.steps && mission.steps.length > 0 ? `
📋 Pasos de la actividad:
${mission.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
` : ''}

${mission.safety && mission.safety.length > 0 ? `
⚠️ Información de seguridad:
${mission.safety.map((safety, index) => `• ${safety}`).join('\n')}
` : ''}

🏷️ Temas: ${mission.topics.join(', ')}
📊 Dificultad: ${getDifficultyText(mission.difficulty)}
⏱️ Duración: ${mission.duration_minutes} minutos
    `.trim();

    Alert.alert(
      'Detalles de la Misión',
      detailsText,
      [
        { text: 'Cerrar', style: 'cancel' }
      ],
      { userInterfaceStyle: 'dark' }
    );
  };

  // Fetch de datos desde la API usando el servicio
  const fetchMissionContent = async (resetData: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentCursor = resetData ? 0 : cursor;
      const data = await MissionEducationService.getMissionEducationContent(currentCursor, 10);
      
      if (resetData) {
        setMissionContent(data.data);
      } else {
        setMissionContent(prev => [...prev, ...data.data]);
      }
      
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error de conexión: ${errorMessage}`);
      Alert.alert(
        'Error de Conexión', 
        `No se pudieron cargar las misiones.\n\nDetalle: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionContent(true);
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

  const renderMissionCard = ({ item }: { item: MissionEducationContent }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => showMissionDetails(item)}
    >
      {/* Header de la tarjeta */}
      <View style={styles.cardHeader}>
        <View style={[styles.typeTag, { backgroundColor: TypeColors[item.type] }]}>
          <Text style={styles.typeText}>{getTypeText(item.type).toUpperCase()}</Text>
        </View>
        <View style={styles.planetInfo}>
          <Text style={styles.planetName}>🪐 {PlanetCodeMap[item.planet_code] || 'Desconocido'}</Text>
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
          <Text style={styles.keyPointsTitle}>Puntos clave de la misión:</Text>
          {item.key_points.slice(0, 2).map((point, index) => (
            <Text key={index} style={styles.keyPoint}>• {point}</Text>
          ))}
          {item.key_points.length > 2 && (
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => showMissionDetails(item)}
            >
              <Text style={styles.morePoints}>+{item.key_points.length - 2} más...</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Pasos de actividad (si existen) */}
      {item.steps && item.steps.length > 0 && (
        <View style={styles.stepsSection}>
          <Text style={styles.stepsTitle}>Pasos de la actividad:</Text>
          {item.steps.slice(0, 1).map((step, index) => (
            <Text key={index} style={styles.step}>1. {step}</Text>
          ))}
          {item.steps.length > 1 && (
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => showMissionDetails(item)}
            >
              <Text style={styles.moreSteps}>+{item.steps.length - 1} pasos más...</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Información de seguridad (si existe) */}
      {item.safety && item.safety.length > 0 && (
        <View style={styles.safetySection}>
          <Text style={styles.safetyTitle}>⚠️ Información de seguridad</Text>
          <Text style={styles.safetyText}>{item.safety[0]}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchMissionContent(false);
    }
  };

  const onRefresh = () => {
    setCursor(0);
    fetchMissionContent(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Misiones Planetarias</Text>
        <Text style={styles.headerSubtitle}>Explorando nuestro sistema solar</Text>
      </View>

      {/* Loading inicial */}
      {loading && missionContent.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Cargando misiones...</Text>
        </View>
      )}

      {/* Lista de misiones */}
      {!loading || missionContent.length > 0 ? (
        <FlatList
          data={missionContent}
          renderItem={renderMissionCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          refreshing={loading && missionContent.length > 0}
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
    paddingTop: 100, // Espacio para el navbar transparente
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
  moreButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    marginTop: 4,
  },
  stepsSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepsTitle: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  step: {
    color: '#ffffff',
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 18,
    marginBottom: 4,
  },
  moreSteps: {
    color: '#4CAF50',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  safetySection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 165, 0, 0.3)',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  safetyTitle: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  safetyText: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.9,
    lineHeight: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default MissionEducationScreen;