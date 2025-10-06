// views/screens/EducationalContentScreen.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    DifficultyColors,
    EXPERIENCE_REWARDS,
    LevelInfo,
    LEVELS_CONFIG,
    MissionEducationContent,
    PlanetCodeMap,
    UserProgress
} from '../../models/MissionEducationModel';
import MissionEducationService from '../../services/MissionEducationService';

const { width } = Dimensions.get('window');

const EducationalContentScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Estados principales
  const [educationData, setEducationData] = useState<MissionEducationContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Sistema de progreso (mock data para diseño)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 2,
    experiencePoints: 180,
    totalContentCompleted: 12,
    streak: 5,
  });

  // Obtener información del nivel actual
  const getCurrentLevel = (): LevelInfo => {
    return LEVELS_CONFIG.find(level => 
      userProgress.experiencePoints >= level.minExperience && 
      userProgress.experiencePoints <= level.maxExperience
    ) || LEVELS_CONFIG[0];
  };

  const getProgressPercentage = (): number => {
    const currentLevel = getCurrentLevel();
    const progress = (userProgress.experiencePoints - currentLevel.minExperience) / 
                    (currentLevel.maxExperience - currentLevel.minExperience);
    return Math.min(progress * 100, 100);
  };

  // Cargar contenido educativo
  const loadEducationalContent = async (resetData: boolean = false) => {
    try {
      if (resetData) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const currentCursor = resetData ? 0 : cursor;
      const data = await MissionEducationService.getMissionEducationContent(currentCursor, 6);
      
      if (resetData) {
        setEducationData(data.data);
      } else {
        setEducationData(prev => [...prev, ...data.data]);
      }
      
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
      
    } catch (err) {
      console.error('❌ [EducationalContentScreen] Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error de conexión: ${errorMessage}`);
      
      if (resetData) {
        Alert.alert(
          'Error de Conexión',
          `No se pudo cargar el contenido educativo.\n\nDetalle: ${errorMessage}`,
          [
            { text: 'Reintentar', onPress: () => loadEducationalContent(true) },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadEducationalContent(true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEducationalContent(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadEducationalContent(false);
    }
  };

  const handleContentPress = (content: MissionEducationContent) => {
    // Mock: simular completar contenido y ganar experiencia
    const experienceGained = content.type === 'guide' ? 
      EXPERIENCE_REWARDS.guide_completed : 
      EXPERIENCE_REWARDS.interactive_completed;
    
    Alert.alert(
      content.title,
      `${content.description}\n\n🎯 Dificultad: ${content.difficulty}\n⏱️ Duración: ${content.duration_minutes} min\n🏆 Experiencia: +${experienceGained} XP`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Comenzar', 
          onPress: () => {
            // Simular ganar experiencia
            setUserProgress(prev => ({
              ...prev,
              experiencePoints: prev.experiencePoints + experienceGained,
              totalContentCompleted: prev.totalContentCompleted + 1,
            }));
            Alert.alert('¡Completado!', `Has ganado ${experienceGained} puntos de experiencia! 🌟`);
          }
        }
      ]
    );
  };

  const renderProgressHeader = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressCard}>
        <View style={styles.levelSection}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{getCurrentLevel().badge}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Nivel {userProgress.level}</Text>
            <Text style={styles.levelSubtitle}>{getCurrentLevel().title}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥{userProgress.streak}</Text>
          </View>
        </View>

        <View style={styles.experienceSection}>
          <View style={styles.experienceInfo}>
            <Text style={styles.experienceText}>
              {userProgress.experiencePoints} / {getCurrentLevel().maxExperience} XP
            </Text>
            <Text style={styles.progressText}>
              {Math.round(getProgressPercentage())}% completado
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProgress.totalContentCompleted}</Text>
            <Text style={styles.statLabel}>Contenidos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{LEVELS_CONFIG.length - userProgress.level}</Text>
            <Text style={styles.statLabel}>Niveles restantes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getCurrentLevel().maxExperience - userProgress.experiencePoints}</Text>
            <Text style={styles.statLabel}>XP para subir</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEducationItem = ({ item }: { item: MissionEducationContent }) => {
    const planetName = PlanetCodeMap[item.planet_code] || 'Desconocido';
    const difficultyColor = DifficultyColors[item.difficulty] || '#666';
    const isInteractive = item.type === 'interactive';
    
    return (
      <TouchableOpacity 
        style={styles.contentCard}
        onPress={() => handleContentPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.contentGradient}>
          {/* Header con tipo y dificultad */}
          <View style={styles.contentHeader}>
            <View style={[styles.typeTag, { 
              backgroundColor: isInteractive ? 'rgba(255, 152, 0, 0.3)' : 'rgba(33, 150, 243, 0.3)' 
            }]}>
              <Text style={styles.typeText}>
                {isInteractive ? '🎯 INTERACTIVO' : '📚 GUÍA'}
              </Text>
            </View>
            <View style={[styles.difficultyTag, { backgroundColor: `${difficultyColor}40` }]}>
              <Text style={styles.difficultyText}>{item.difficulty.toUpperCase()}</Text>
            </View>
          </View>

          {/* Título y planeta */}
          <Text style={styles.contentTitle}>{item.title}</Text>
          <Text style={styles.planetText}>🪐 {planetName}</Text>

          {/* Descripción */}
          <Text style={styles.contentDescription} numberOfLines={3}>
            {item.description}
          </Text>

          {/* Información adicional */}
          <View style={styles.contentFooter}>
            <View style={styles.durationInfo}>
              <Text style={styles.durationText}>⏱️ {item.duration_minutes} min</Text>
            </View>
            <View style={styles.topicsContainer}>
              {item.topics.slice(0, 2).map((topic, index) => (
                <View key={index} style={styles.topicTag}>
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
              {item.topics.length > 2 && (
                <Text style={styles.moreTopics}>+{item.topics.length - 2}</Text>
              )}
            </View>
          </View>

          {/* Puntos de experiencia */}
          <View style={styles.experienceReward}>
            <Text style={styles.experienceRewardText}>
              +{isInteractive ? EXPERIENCE_REWARDS.interactive_completed : EXPERIENCE_REWARDS.guide_completed} XP
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#00d4ff" />
        <Text style={styles.footerText}>Cargando más contenido...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyText}>
        No hay contenido educativo disponible en este momento.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadEducationalContent(true)}>
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ImageBackground 
        source={require('../../../assets/images/background-c.jpg')}
        style={styles.container}
        imageStyle={{ opacity: 0.6 }}
      >
        <LinearGradient
          colors={['rgba(28, 16, 55, 0.85)', 'rgba(28, 16, 55, 0.85)', '#0A0E27']}
          locations={[0, 0.5, 1]}
          style={styles.gradientOverlay}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Cargando contenido educativo...</Text>
        </View>
      </ImageBackground>
    );
  }

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

      <FlatList
        data={educationData}
        renderItem={renderEducationItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderProgressHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00d4ff"
            colors={['#00d4ff']}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
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
  flatListContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  // Estilos del header de progreso
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 60, // Agregado para compensar la ausencia del header
  },
  progressCard: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  levelBadgeText: {
    fontSize: 24,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: 'bold',
  },
  experienceSection: {
    marginBottom: 15,
  },
  experienceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  // Estilos de tarjetas de contenido
  contentCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentGradient: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeTag: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  difficultyTag: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  planetText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  contentDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  durationInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  topicsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicTag: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
  },
  topicText: {
    color: '#00d4ff',
    fontSize: 10,
    fontWeight: '500',
  },
  moreTopics: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginLeft: 6,
  },
  experienceReward: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  experienceRewardText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Estilos de estados de carga
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default EducationalContentScreen;