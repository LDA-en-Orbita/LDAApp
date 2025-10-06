// views/screens/AllMissionsScreen.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
import { MissionData } from '../../models/MissionModel';
import MissionService from '../../services/MissionService';

const { width } = Dimensions.get('window');

// Mapeo de códigos de planetas a nombres en español
const PlanetCodeMap: { [key: string]: string } = {
  '199': 'Mercurio',
  '299': 'Venus',
  '399': 'Tierra',
  '499': 'Marte',
  '599': 'Júpiter',
  '699': 'Saturno',
  '799': 'Urano',
  '899': 'Neptuno',
  '999': 'Plutón',
};

// Mapeo de tipos de misión a colores
const MissionTypeColors: { [key: string]: string } = {
  'orbiter': '#4CAF50',
  'rover': '#FF9800',
  'lander': '#2196F3',
  'flyby': '#9C27B0',
  'impactor': '#F44336',
  'sample_return': '#00BCD4',
  'atmospheric': '#795548',
  'relay': '#607D8B',
};

// Mapeo de estados de misión a colores
const StatusColors: { [key: string]: string } = {
  'active': '#4CAF50',
  'en_transito': '#FF9800',
  'completed': '#2196F3',
  'completado': '#2196F3',
  'planned': '#9C27B0',
  'cancelled': '#F44336',
  'failed': '#F44336',
};

const AllMissionsScreen: React.FC = () => {
  const router = useRouter();
  
  // Estados principales
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    completed: number;
    agencies: string[];
    missionTypes: string[];
  } | null>(null);

  // Cargar misiones con paginación
  const loadMissions = async (resetData: boolean = false) => {
    try {
      console.log(`🚀 [AllMissionsScreen] ${resetData ? 'Carga inicial' : 'Carga más datos'} - cursor: ${resetData ? 0 : cursor}`);
      
      if (resetData) {
        setLoading(true);
        setError(null);
        setMissions([]);
      } else {
        setLoadingMore(true);
      }

      const currentCursor = resetData ? 0 : cursor;
      console.log(`📡 [AllMissionsScreen] Llamando API con cursor: ${currentCursor}`);
      
      const data = await MissionService.getMissionsWithPagination(currentCursor, 6);
      
      console.log(`✅ [AllMissionsScreen] Datos recibidos:`, {
        missions: data.data.length,
        nextCursor: data.nextCursor,
        hasMore: data.hasMore
      });
      
      if (resetData) {
        setMissions(data.data);
        setCursor(data.nextCursor);
      } else {
        setMissions(prev => {
          const newMissions = [...prev, ...data.data];
          console.log(`📝 [AllMissionsScreen] Total misiones después de agregar: ${newMissions.length}`);
          return newMissions;
        });
        setCursor(data.nextCursor);
      }
      
      setHasMore(data.hasMore);
      
    } catch (err) {
      console.error('❌ [AllMissionsScreen] Error al cargar misiones:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error de conexión: ${errorMessage}`);
      
      if (resetData) {
        Alert.alert(
          'Error de Conexión',
          `No se pudieron cargar las misiones.\n\nDetalle: ${errorMessage}`,
          [
            { text: 'Reintentar', onPress: () => loadMissions(true) },
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

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      console.log('📊 [AllMissionsScreen] Cargando estadísticas...');
      const statsData = await MissionService.getMissionStats();
      console.log('✅ [AllMissionsScreen] Estadísticas cargadas:', statsData);
      setStats(statsData);
    } catch (err) {
      console.error('⚠️ [AllMissionsScreen] Error loading stats (no crítico):', err);
      // No mostrar error al usuario, las stats son opcionales
    }
  };

  useEffect(() => {
    console.log('🎬 [AllMissionsScreen] Componente montado, iniciando carga...');
    loadMissions(true);
    // Cargar stats después de un delay para no interferir
    setTimeout(() => {
      loadStats();
    }, 2000);
  }, []);

  const handleRefresh = () => {
    console.log('🔄 [AllMissionsScreen] Iniciando refresh...');
    setRefreshing(true);
    setStats(null); // Reset stats
    loadMissions(true);
    setTimeout(() => {
      loadStats();
    }, 1000);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadMissions(false);
    }
  };

  const handleMissionPress = (mission: MissionData) => {
    Alert.alert(
      mission.name_es || mission.name,
      `${mission.description}\n\n🌍 Planeta: ${PlanetCodeMap[mission.planet_code] || 'Desconocido'}\n🚀 Agencia: ${mission.agency}\n📅 Estado: ${mission.current_status_description}`,
      [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Ver Detalles', onPress: () => console.log('Ver detalles de:', mission.id) }
      ]
    );
  };

  const renderStatsHeader = () => {
    if (!stats) return null;
    
    return (
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['rgba(0, 212, 255, 0.2)', 'rgba(144, 19, 254, 0.2)']}
          style={styles.statsCard}
        >
          <Text style={styles.statsTitle}>Misiones Espaciales 🚀</Text>
          <Text style={styles.statsSubtitle}>Explorando nuestro sistema solar</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.active}</Text>
              <Text style={styles.statLabel}>Activas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.agencies.length}</Text>
              <Text style={styles.statLabel}>Agencias</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderMissionItem = ({ item }: { item: MissionData }) => {
    const planetName = PlanetCodeMap[item.planet_code] || `Planeta ${item.planet_code}`;
    const typeColor = MissionTypeColors[item.mission_type] || '#666';
    const statusColor = StatusColors[item.status] || '#666';
    
    console.log(`🎯 [AllMissionsScreen] Renderizando misión: ${item.name} (${item.id})`);
    
    return (
      <TouchableOpacity 
        style={styles.missionCard}
        onPress={() => handleMissionPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.missionGradient}
        >
          {/* Header con tipo y estado */}
          <View style={styles.missionHeader}>
            <View style={[styles.typeTag, { backgroundColor: `${typeColor}40` }]}>
              <Text style={styles.typeText}>{item.mission_type?.toUpperCase() || 'MISIÓN'}</Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: `${statusColor}40` }]}>
              <Text style={styles.statusText}>{item.status?.toUpperCase() || 'DESCONOCIDO'}</Text>
            </View>
          </View>

          {/* Título y agencia */}
          <Text style={styles.missionTitle}>{item.name_es || item.name || 'Misión sin nombre'}</Text>
          <Text style={styles.agencyText}>🏢 {item.agency || 'Agencia desconocida'}</Text>

          {/* Planeta y objetivo */}
          <View style={styles.targetInfo}>
            <Text style={styles.planetText}>🪐 {planetName}</Text>
            {item.primary_target && (
              <Text style={styles.primaryTargetText}>🎯 {item.primary_target}</Text>
            )}
          </View>

          {/* Descripción */}
          <Text style={styles.missionDescription} numberOfLines={2}>
            {item.description || 'No hay descripción disponible'}
          </Text>

          {/* Fechas importantes */}
          <View style={styles.datesInfo}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Lanzamiento</Text>
              <Text style={styles.dateValue}>
                {item.launch_date ? new Date(item.launch_date).toLocaleDateString('es-ES') : 'No disponible'}
              </Text>
            </View>
            {item.arrival_date && (
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Llegada</Text>
                <Text style={styles.dateValue}>
                  {new Date(item.arrival_date).toLocaleDateString('es-ES')}
                </Text>
              </View>
            )}
          </View>

          {/* Estado actual */}
          <View style={styles.currentStatus}>
            <Text style={styles.currentStatusText}>
              📡 {item.current_status_description || 'Estado no disponible'}
            </Text>
          </View>

          {/* Indicadores de contenido adicional */}
          <View style={styles.contentIndicators}>
            {item.achievements && item.achievements.length > 0 && (
              <View style={styles.indicator}>
                <Text style={styles.indicatorText}>🏆 {item.achievements.length}</Text>
              </View>
            )}
            {item.scientific_objectives && item.scientific_objectives.length > 0 && (
              <View style={styles.indicator}>
                <Text style={styles.indicatorText}>🔬 {item.scientific_objectives.length}</Text>
              </View>
            )}
            {item.key_instruments && item.key_instruments.length > 0 && (
              <View style={styles.indicator}>
                <Text style={styles.indicatorText}>🛰️ {item.key_instruments.length}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#00d4ff" />
        <Text style={styles.footerText}>Cargando más misiones...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🚀</Text>
      <Text style={styles.emptyText}>
        No hay misiones disponibles en este momento.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadMissions(true)}>
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
          <Text style={styles.loadingText}>Cargando misiones espaciales...</Text>
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
      <LinearGradient
        colors={['rgba(28, 16, 55, 0.85)', 'rgba(28, 16, 55, 0.85)', '#0A0E27']}
        locations={[0, 0.5, 1]}
        style={styles.gradientOverlay}
      />

      <FlatList
        data={missions}
        renderItem={renderMissionItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderStatsHeader}
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
  // Estilos del header de estadísticas
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 60,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  statsSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#00d4ff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  // Estilos de tarjetas de misión
  missionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  missionGradient: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  missionHeader: {
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
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTag: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  missionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  agencyText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  targetInfo: {
    marginBottom: 10,
  },
  planetText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 4,
  },
  primaryTargetText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  missionDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  datesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 2,
  },
  dateValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  currentStatus: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  currentStatusText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '500',
  },
  contentIndicators: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  indicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  indicatorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '500',
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

export default AllMissionsScreen;