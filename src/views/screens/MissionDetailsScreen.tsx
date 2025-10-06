// views/screens/MissionDetailsScreen.tsx
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { MissionData } from '../../models/MissionModel';
import MissionService from '../../services/MissionService';

const { width } = Dimensions.get('window');

interface MissionDetailsScreenProps {
  planetCode?: string;
  planetName?: string;
}

const MissionDetailsScreen: React.FC<MissionDetailsScreenProps> = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Obtener parámetros de navegación
  const planetName = params.planetName as string || 'Venus'; // Nombre en inglés para API
  const planetNameEs = params.planetNameEs as string || 'Venus'; // Nombre en español para UI
  const planetCode = params.planetCode as string;
  
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Fetch de misiones desde la API
  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const missionsData = await MissionService.getMissionsByPlanet(planetName);
      setMissions(missionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [planetName]);

  const toggleSection = (missionId: string, section: string) => {
    const key = `${missionId}-${section}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <ImageBackground 
      source={require('../../../assets/images/background-c.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.6 }}
    >
      <LinearGradient
        colors={['rgba(28, 16, 55, 0.85)', '#0A0E27']}
        style={styles.gradientOverlay}
      />

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Cargando misiones de {planetNameEs}...</Text>
        </View>
      )}

      {/* Empty State */}
      {!loading && missions.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🚀</Text>
          <Text style={styles.emptyText}>
            No hay misiones disponibles para {planetNameEs}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Volver a Planetas</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {!loading && missions.length > 0 && (

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Misiones Espaciales</Text>
              <Text style={styles.headerSubtitle}>{planetNameEs}</Text>
            </View>
          </View>

          {/* Contador de misiones */}
          <View style={styles.missionCounter}>
            <View style={styles.counterCard}>
              <Text style={styles.counterNumber}>{missions.length}</Text>
              <Text style={styles.counterLabel}>Misiones</Text>
            </View>
            <View style={styles.counterCard}>
              <Text style={styles.counterNumber}>{missions.filter(m => m.status === 'completed').length}</Text>
              <Text style={styles.counterLabel}>Completadas</Text>
            </View>
            <View style={styles.counterCard}>
              <Text style={styles.counterNumber}>{missions.filter(m => m.status === 'active').length}</Text>
              <Text style={styles.counterLabel}>Activas</Text>
            </View>
          </View>

          {missions.map((mission) => (
            <View key={mission.id} style={styles.missionCard}>
              {/* Imagen de la misión */}
              <View style={styles.missionImageContainer}>
                <Image
                  source={require('../../../assets/images/planet/earth.png')}
                  style={styles.missionImage}
                  contentFit="cover"
                />
              </View>

              {/* Nombre de la misión */}
              <View style={styles.missionHeader}>
                <Text style={styles.missionName}>{mission.name_es}</Text>
                <View style={styles.planetBadge}>
                  <View style={styles.planetDot} />
                  <Text style={styles.planetBadgeText}>{mission.target_body}</Text>
                </View>
              </View>

              {/* Descripción */}
              <Text style={styles.missionDescription}>{mission.description}</Text>

              {/* Tarjetas de información clave */}
              <View style={styles.infoCardsContainer}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Lanzamiento</Text>
                  <Text style={styles.infoValue}>{new Date(mission.launch_date).getFullYear()}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Duración Total</Text>
                  <Text style={styles.infoValue}>{mission.mission_duration.total_years} años</Text>
                </View>
              </View>

              <View style={styles.infoCardsContainer}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Superficie Mapeada</Text>
                  <Text style={styles.infoValue}>98%</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>En Órbita</Text>
                  <Text style={styles.infoValue}>{mission.mission_duration.orbital_years} años</Text>
                </View>
              </View>

              {/* Línea de Tiempo */}
              <Text style={styles.sectionTitle}>Línea de Tiempo</Text>
              <View style={styles.timelineContainer}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>{formatDate(mission.launch_date)}</Text>
                    <Text style={styles.timelineTitle}>Lanzamiento</Text>
                    <Text style={styles.timelineDescription}>
                      Despegue desde el transbordador espacial Atlantis
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>{formatDate(mission.arrival_date)}</Text>
                    <Text style={styles.timelineTitle}>Llegada a {planetName}</Text>
                    <Text style={styles.timelineDescription}>
                      Entrada exitosa en órbita venusiana
                    </Text>
                  </View>
                </View>

                {mission.achievements.map((achievement, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineDate}>{achievement.year}</Text>
                      <Text style={styles.timelineTitle}>{achievement.description.split(' ').slice(0, 4).join(' ')}</Text>
                      <Text style={styles.timelineDescription}>
                        {achievement.description}
                      </Text>
                    </View>
                  </View>
                ))}

                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>{formatDate(mission.mission_end_date)}</Text>
                    <Text style={styles.timelineTitle}>Fin de Misión</Text>
                    <Text style={styles.timelineDescription}>
                      {mission.current_status_description}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Logros Principales */}
              <Text style={styles.sectionTitle}>Logros Principales</Text>
              <View style={styles.achievementsContainer}>
                {mission.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementCard}>
                    <View style={styles.achievementIcon}>
                      <Text style={styles.achievementIconText}>🏆</Text>
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementYear}>{achievement.year}</Text>
                      <Text style={styles.achievementTitle}>{achievement.description}</Text>
                      <Text style={styles.achievementDescription}>{achievement.significance}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Objetivos Científicos */}
              <Text style={styles.sectionTitle}>Objetivos Científicos</Text>
              <View style={styles.objectivesContainer}>
                {mission.scientific_objectives.map((objective, index) => (
                  <View key={index} style={styles.objectiveChip}>
                    <Text style={styles.objectiveText}>{objective}</Text>
                  </View>
                ))}
              </View>

              {/* Instrumentos Principales */}
              <Text style={styles.sectionTitle}>Instrumentos Principales</Text>
              <View style={styles.instrumentsContainer}>
                {mission.key_instruments.map((instrument, index) => (
                  <View key={index} style={styles.instrumentItem}>
                    <Text style={styles.instrumentText}>• {instrument}</Text>
                  </View>
                ))}
              </View>

              {/* Botones de acción */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Ver Detalles</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => router.push({
                    pathname: '/screens/image-gallery',
                    params: {
                      planetName: planetName.toLowerCase(),
                      planetDisplayName: planetNameEs
                    }
                  })}
                >
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      )}
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
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonHeader: {
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
  missionCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  counterCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 50, 80, 0.6)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  counterNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  counterLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  missionCard: {
    backgroundColor: 'rgba(10, 14, 39, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  missionImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  missionImage: {
    width: '100%',
    height: '100%',
  },
  missionHeader: {
    marginBottom: 12,
  },
  missionName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  planetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 100, 100, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  planetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6464',
    marginRight: 6,
  },
  planetBadgeText: {
    color: '#ff6464',
    fontSize: 13,
    fontWeight: '600',
  },
  missionDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 20,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 50, 80, 0.8)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginTop: 24,
    marginBottom: 16,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00d4ff',
    marginRight: 16,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 12,
    color: '#00d4ff',
    marginBottom: 4,
    fontWeight: '600',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  achievementsContainer: {
    gap: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 50, 80, 0.6)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementYear: {
    fontSize: 12,
    color: '#00d4ff',
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  objectivesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  objectiveChip: {
    backgroundColor: 'rgba(59, 157, 201, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3B9DC9',
  },
  objectiveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  instrumentsContainer: {
    gap: 8,
  },
  instrumentItem: {
    paddingVertical: 8,
  },
  instrumentText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
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
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3B9DC9',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MissionDetailsScreen;
