import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Navigation, Filter, Zap, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { zonesAPI } from '@/lib/supabase';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [legalZones, setLegalZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    loadLegalZones();
  }, []);

  const loadLegalZones = async () => {
    try {
      setLoading(true);
      const zones = await zonesAPI.getAll();
      setLegalZones(zones || []);
    } catch (error) {
      console.error('Error loading legal zones:', error);
      // Zones will be loaded from fallback data in the API
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All Zones', color: '#40E0FF' },
    { id: 'safe', label: 'Safe', color: '#10B981' },
    { id: 'moderate', label: 'Moderate', color: '#F59E0B' },
    { id: 'restricted', label: 'Restricted', color: '#EF4444' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'restricted':
        return <AlertTriangle size={18} color="#FFFFFF" />;
      case 'moderate':
        return <Clock size={18} color="#FFFFFF" />;
      case 'safe':
        return <CheckCircle size={18} color="#FFFFFF" />;
      default:
        return <MapPin size={18} color="#FFFFFF" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'restricted': return ['#EF4444', '#DC2626'];
      case 'moderate': return ['#F59E0B', '#D97706'];
      case 'safe': return ['#10B981', '#059669'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const filteredZones = selectedFilter === 'all' 
    ? legalZones 
    : legalZones.filter(zone => zone.status === selectedFilter);

  const handleZonePress = (zone: any) => {
    const distance = `${(Math.random() * 5 + 0.5).toFixed(1)} km`;
    Alert.alert(
      `${zone.name} 📍`,
      `${zone.description}\n\nDistance: ${distance}\nSeverity: ${zone.severity}\n\nRules:\n${zone.rules.map((rule: string) => `• ${rule}`).join('\n')}`,
      [
        { text: "Get Directions", style: "default" },
        { text: "Close", style: "cancel" }
      ]
    );
  };

  const handleMapPress = () => {
    Alert.alert(
      "Interactive Map 🗺️",
      "Opening full interactive legal zone map with real-time updates and navigation.",
      [{ text: "Open Map", style: "default" }]
    );
  };

  const handleDirections = () => {
    Alert.alert(
      "Navigation 🧭",
      "Starting GPS navigation to the nearest safe legal zone.",
      [{ text: "Start Navigation", style: "default" }]
    );
  };

  const handleReportIssue = () => {
    Alert.alert(
      "Report Legal Issue 📝",
      "Report legal concerns or violations in your area to help other users stay informed.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Report", style: "default" }
      ]
    );
  };

  const handleFilterChange = async (filterId: string) => {
    setSelectedFilter(filterId);
    if (filterId !== 'all') {
      try {
        const filteredData = await zonesAPI.getByStatus(filterId as 'safe' | 'moderate' | 'restricted');
        setLegalZones(filteredData || []);
      } catch (error) {
        console.error('Error filtering zones:', error);
        // Will use fallback data
      }
    } else {
      loadLegalZones();
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View>
              <Text style={styles.title}>Legal Zones</Text>
              <Text style={styles.subtitle}>Navigate safely with real-time legal information</Text>
            </View>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#40E0FF', '#1E40AF']}
                style={styles.filterButtonGradient}
              >
                <Filter size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Map Container */}
          <Animated.View 
            style={[
              styles.mapContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity onPress={handleMapPress} activeOpacity={0.8}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=800' }}
                style={styles.mapImage}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
                style={styles.mapOverlay}
              >
                <View style={styles.mapHeader}>
                  <Navigation size={24} color="#40E0FF" />
                  <Text style={styles.mapTitle}>Interactive Legal Zone Map</Text>
                </View>
                <Text style={styles.mapLocation}>Delhi, India • Live Updates</Text>
                <View style={styles.mapStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{legalZones.length}</Text>
                    <Text style={styles.statLabel}>Zones</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{legalZones.filter(z => z.status === 'restricted').length}</Text>
                    <Text style={styles.statLabel}>Alerts</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>Live</Text>
                    <Text style={styles.statLabel}>Updates</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.fullMapButton} onPress={handleMapPress}>
                  <LinearGradient
                    colors={['#40E0FF', '#1E40AF']}
                    style={styles.fullMapButtonGradient}
                  >
                    <Text style={styles.fullMapText}>View Full Map</Text>
                    <Zap size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Filter Tabs */}
          <Animated.View 
            style={[
              styles.filterContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterTab,
                    selectedFilter === filter.id && styles.filterTabActive
                  ]}
                  onPress={() => handleFilterChange(filter.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={selectedFilter === filter.id 
                      ? [filter.color, filter.color + '80'] 
                      : ['#374151', '#1F2937']
                    }
                    style={styles.filterTabGradient}
                  >
                    <Text style={[
                      styles.filterTabText,
                      selectedFilter === filter.id && styles.filterTabTextActive
                    ]}>
                      {filter.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Zone Legend */}
          <Animated.View 
            style={[
              styles.legendContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['#1F2937', '#111827']}
              style={styles.legendGradient}
            >
              <Text style={styles.legendTitle}>Zone Status Guide</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.legendText}>Safe - Minimal restrictions</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.legendText}>Moderate - Some limitations</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.legendText}>Restricted - High security</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Nearby Zones */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedFilter === 'all' ? 'Nearby Legal Zones' : `${filters.find(f => f.id === selectedFilter)?.label} Zones`}
              </Text>
              <Text style={styles.zoneCount}>{filteredZones.length} zones</Text>
            </View>

            <View style={styles.zonesContainer}>
              {filteredZones.map((zone, index) => (
                <TouchableOpacity 
                  key={zone.id} 
                  style={styles.zoneCard}
                  onPress={() => handleZonePress(zone)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#1F2937', '#111827']}
                    style={styles.zoneCardGradient}
                  >
                    <View style={styles.zoneHeader}>
                      <View style={styles.zoneInfo}>
                        <View style={styles.zoneTitleRow}>
                          <LinearGradient
                            colors={getStatusGradient(zone.status)}
                            style={styles.zoneStatusIcon}
                          >
                            {getStatusIcon(zone.status)}
                          </LinearGradient>
                          <Text style={styles.zoneName}>{zone.name}</Text>
                        </View>
                        <View style={styles.zoneDetails}>
                          <MapPin size={14} color="#6B7280" />
                          <Text style={styles.zoneDistance}>{(Math.random() * 5 + 0.5).toFixed(1)} km away</Text>
                          <View style={[styles.severityBadge, { backgroundColor: `${getSeverityColor(zone.severity)}20` }]}>
                            <Text style={[styles.severityText, { color: getSeverityColor(zone.severity) }]}>
                              {zone.severity}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.zoneDescription}>{zone.description}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.rulesContainer}>
                      {zone.rules.slice(0, 2).map((rule: string, ruleIndex: number) => (
                        <View key={ruleIndex} style={styles.ruleTag}>
                          <Text style={styles.ruleText}>{rule}</Text>
                        </View>
                      ))}
                      {zone.rules.length > 2 && (
                        <View style={styles.moreRulesTag}>
                          <Text style={styles.moreRulesText}>+{zone.rules.length - 2} more</Text>
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity style={styles.quickActionCard} onPress={handleDirections} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#1F2937', '#111827']}
                  style={styles.quickActionGradient}
                >
                  <LinearGradient
                    colors={['#40E0FF', '#1E40AF']}
                    style={styles.quickActionIcon}
                  >
                    <Navigation size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.quickActionTitle}>Get Directions</Text>
                  <Text style={styles.quickActionSubtitle}>Navigate to safe zones</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} onPress={handleReportIssue} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#1F2937', '#111827']}
                  style={styles.quickActionGradient}
                >
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.quickActionIcon}
                  >
                    <AlertTriangle size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.quickActionTitle}>Report Issue</Text>
                  <Text style={styles.quickActionSubtitle}>Flag legal concerns</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: width < 380 ? 16 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: width < 380 ? 24 : 28,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  filterButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filterButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  mapLocation: {
    fontSize: 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    marginBottom: 16,
  },
  mapStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    color: '#40E0FF',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  fullMapButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  fullMapButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  fullMapText: {
    fontSize: 14,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterScrollView: {
    paddingHorizontal: 4,
  },
  filterTab: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  filterTabActive: {
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filterTabGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#9CA3AF',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  legendContainer: {
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  legendGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  legendTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  legendItems: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: '#9CA3AF',
    fontFamily: 'Rajdhani-Medium',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: width < 380 ? 18 : 20,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  zoneCount: {
    fontSize: 14,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#40E0FF',
  },
  zonesContainer: {
    marginBottom: 30,
  },
  zoneCard: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  zoneCardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  zoneHeader: {
    marginBottom: 16,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  zoneStatusIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  zoneName: {
    fontSize: 18,
    fontFamily: 'Orbitron-SemiBold',
    color: '#FFFFFF',
    flex: 1,
  },
  zoneDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  zoneDistance: {
    fontSize: 12,
    fontFamily: 'Rajdhani-Medium',
    color: '#6B7280',
    marginLeft: 4,
    marginRight: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 10,
    fontFamily: 'Rajdhani-Bold',
    textTransform: 'uppercase',
  },
  zoneDescription: {
    fontSize: 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    lineHeight: 18,
  },
  rulesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ruleTag: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ruleText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Rajdhani-Medium',
  },
  moreRulesTag: {
    backgroundColor: '#40E0FF20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#40E0FF40',
  },
  moreRulesText: {
    color: '#40E0FF',
    fontSize: 11,
    fontFamily: 'Rajdhani-SemiBold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  quickActionCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  quickActionGradient: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Orbitron-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 11,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});