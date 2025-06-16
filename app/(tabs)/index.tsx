import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Clock, TriangleAlert as AlertTriangle, Shield, Car, Smartphone, Heart, ChevronRight, TrendingUp, Zap, Award, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { lawsAPI, newsAPI, progressAPI } from '@/lib/supabase';
import { router } from 'expo-router';
import LawOrLolGame from '@/components/LawOrLolGame';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({
    laws_learned: 47,
    quiz_score: 85,
    study_streak: 12
  });
  const [loading, setLoading] = useState(true);

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

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load recent news with fallback
      try {
        const news = await newsAPI.getLatest();
        setRecentNews(news?.slice(0, 3) || []);
      } catch (error) {
        console.log('Using sample news data');
        setRecentNews([
          {
            title: 'New Consumer Protection Guidelines Released',
            summary: 'Government announces enhanced consumer protection measures for online shopping.',
            published_at: new Date().toISOString(),
            category: 'Consumer Rights'
          },
          {
            title: 'Traffic Law Amendments in Major Cities',
            summary: 'Updated traffic regulations and penalties come into effect.',
            published_at: new Date().toISOString(),
            category: 'Traffic Laws'
          },
          {
            title: 'Digital Privacy Rights Update',
            summary: 'New guidelines for data protection and digital privacy.',
            published_at: new Date().toISOString(),
            category: 'Cyber Law'
          }
        ]);
      }

      // Load user progress with proper error handling
      try {
        const progress = await progressAPI.getUserProgress('demo-user');
        if (progress) {
          setUserStats({
            laws_learned: progress.laws_learned || 47,
            quiz_score: progress.quiz_score || 85,
            study_streak: progress.study_streak || 12
          });
        }
      } catch (error) {
        console.log('Using default user stats');
        // Keep default stats
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await lawsAPI.search(searchQuery);
      Alert.alert(
        'Search Results',
        `Found ${results?.length || 0} laws related to "${searchQuery}"`,
        [
          { text: 'View Results', onPress: () => router.push('/learn') },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } catch (error) {
      Alert.alert('Search', `Searching for laws related to "${searchQuery}". Check the Learn section for results.`);
    }
  };

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case 'local':
          Alert.alert(
            'Local Laws - Delhi',
            'Access local laws and regulations specific to your area including municipal laws, local ordinances, and regional guidelines.',
            [
              { text: 'View Laws', onPress: () => router.push('/learn') },
              { text: 'OK', style: 'cancel' }
            ]
          );
          break;
        case 'recent':
          Alert.alert(
            'Recent Updates',
            `${recentNews.length} recent legal updates available including new laws, amendments, and important legal developments.`,
            [
              { text: 'View Updates', onPress: () => router.push('/learn') },
              { text: 'OK', style: 'cancel' }
            ]
          );
          break;
        case 'zones':
          router.push('/map');
          break;
        case 'emergency':
          Alert.alert(
            'Emergency Legal Info',
            'Emergency Contacts:\n• Police: 100\n• Women Helpline: 1091\n• Legal Aid: 15100\n• Consumer Helpline: 1915\n• Cyber Crime: 155260',
            [{ text: 'OK' }]
          );
          break;
      }
    } catch (error) {
      Alert.alert('Information', 'Loading legal information. Please check the relevant sections for detailed content.');
    }
  };

  const handleCategoryPress = async (category: string) => {
    try {
      Alert.alert(
        category,
        `Explore comprehensive information about ${category} including relevant laws, procedures, and your rights and responsibilities.`,
        [
          { text: 'Learn More', onPress: () => router.push('/learn') },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } catch (error) {
      Alert.alert('Category', `Learn about ${category} in the Learn section.`);
    }
  };

  const stats = [
    { title: 'Laws Learned', value: userStats.laws_learned.toString(), change: '+12%', icon: <Shield size={width < 380 ? 16 : 18} color="#40E0FF" />, gradient: ['#40E0FF', '#1E40AF'] },
    { title: 'Quiz Score', value: `${userStats.quiz_score}%`, change: '+5%', icon: <TrendingUp size={width < 380 ? 16 : 18} color="#10B981" />, gradient: ['#10B981', '#059669'] },
    { title: 'Study Streak', value: userStats.study_streak.toString(), change: 'days', icon: <Zap size={width < 380 ? 16 : 18} color="#F59E0B" />, gradient: ['#F59E0B', '#D97706'] },
  ];

  const quickActions = [
    { title: 'Local Laws', subtitle: 'Delhi regulations', icon: <MapPin size={width < 380 ? 20 : 22} color="#40E0FF" />, gradient: ['#40E0FF20', '#1E40AF20'], action: 'local' },
    { title: 'Recent Updates', subtitle: 'Latest changes', icon: <Clock size={width < 380 ? 20 : 22} color="#10B981" />, gradient: ['#10B98120', '#05966920'], action: 'recent' },
    { title: 'Legal Zones', subtitle: 'Nearby areas', icon: <AlertTriangle size={width < 380 ? 20 : 22} color="#F59E0B" />, gradient: ['#F59E0B20', '#D9770620'], action: 'zones' },
    { title: 'Emergency Info', subtitle: 'Quick access', icon: <Shield size={width < 380 ? 20 : 22} color="#EF4444" />, gradient: ['#EF444420', '#DC262620'], action: 'emergency' },
  ];

  const categories = [
    { title: 'Traffic Laws', icon: <Car size={width < 380 ? 16 : 18} color="#FFFFFF" />, gradient: ['#3B82F6', '#1E40AF'], count: '24 topics' },
    { title: 'Cyber Law', icon: <Smartphone size={width < 380 ? 16 : 18} color="#FFFFFF" />, gradient: ['#8B5CF6', '#7C3AED'], count: '18 topics' },
    { title: 'Women Rights', icon: <Heart size={width < 380 ? 16 : 18} color="#FFFFFF" />, gradient: ['#EC4899', '#DB2777'], count: '31 topics' },
    { title: 'Consumer Rights', icon: <Shield size={width < 380 ? 16 : 18} color="#FFFFFF" />, gradient: ['#10B981', '#059669'], count: '15 topics' },
  ];

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
              <Text style={styles.greeting}>Good Morning</Text>
              <View style={styles.locationContainer}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.location}>Delhi, India</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#40E0FF', '#1E40AF']}
                style={styles.profileGradient}
              >
                <Text style={styles.profileInitial}>A</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Search Bar */}
          <Animated.View 
            style={[
              styles.searchContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Search size={16} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search laws, rights, or ask questions..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.8}>
              <LinearGradient
                colors={['#40E0FF', '#1E40AF']}
                style={styles.searchButtonGradient}
              >
                <Search size={14} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Stats Cards */}
          <Animated.View 
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {stats.map((stat, index) => (
              <TouchableOpacity key={index} style={styles.statCard} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#1F2937', '#111827']}
                  style={styles.statCardGradient}
                >
                  <View style={styles.statHeader}>
                    <LinearGradient
                      colors={stat.gradient}
                      style={styles.statIconContainer}
                    >
                      {stat.icon}
                    </LinearGradient>
                    <Text style={styles.statChange}>{stat.change}</Text>
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.quickActionCard} 
                  onPress={() => handleQuickAction(action.action)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#1F2937', '#111827']}
                    style={styles.quickActionGradient}
                  >
                    <LinearGradient
                      colors={action.gradient}
                      style={styles.quickActionIcon}
                    >
                      {action.icon}
                    </LinearGradient>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Categories */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Law Categories</Text>
              <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/learn')} activeOpacity={0.8}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={14} color="#40E0FF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.categoriesContainer}>
              {categories.map((category, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.categoryCard} 
                  onPress={() => handleCategoryPress(category.title)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#1F2937', '#111827']}
                    style={styles.categoryCardGradient}
                  >
                    <LinearGradient
                      colors={category.gradient}
                      style={styles.categoryIcon}
                    >
                      {category.icon}
                    </LinearGradient>
                    <View style={styles.categoryContent}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryCount}>{category.count}</Text>
                    </View>
                    <ChevronRight size={16} color="#6B7280" />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Recent News */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.sectionTitle}>Recent Legal Updates</Text>
            {recentNews.map((news, index) => (
              <TouchableOpacity key={index} style={styles.newsCard} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#1F2937', '#111827']}
                  style={styles.newsCardGradient}
                >
                  <View style={styles.newsHeader}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={styles.newsIcon}
                    >
                      <BookOpen size={18} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.newsContent}>
                      <Text style={styles.newsTitle} numberOfLines={2}>{news.title}</Text>
                      <Text style={styles.newsSummary} numberOfLines={2}>{news.summary}</Text>
                      <Text style={styles.newsDate}>
                        {new Date(news.published_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Law or LOL Game */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <LawOrLolGame />
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
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: width < 380 ? 24 : 28,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  profileButton: {
    width: width < 380 ? 40 : 44,
    height: width < 380 ? 40 : 44,
    borderRadius: width < 380 ? 20 : 22,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  profileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: width < 380 ? 16 : 18,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: width < 380 ? 10 : 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    color: '#FFFFFF',
    fontFamily: 'Rajdhani-Medium',
    fontSize: width < 380 ? 14 : 16,
  },
  searchButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  searchButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  statCardGradient: {
    padding: width < 380 ? 12 : 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIconContainer: {
    width: width < 380 ? 28 : 32,
    height: width < 380 ? 28 : 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statChange: {
    fontSize: width < 380 ? 10 : 12,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#10B981',
  },
  statValue: {
    fontSize: width < 380 ? 20 : 24,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  statTitle: {
    fontSize: width < 380 ? 10 : 12,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: width < 380 ? 18 : 20,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 14,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#40E0FF20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#40E0FF40',
  },
  seeAllText: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#40E0FF',
    marginRight: 3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  quickActionCard: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  quickActionGradient: {
    padding: width < 380 ? 12 : 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  quickActionIcon: {
    width: width < 380 ? 36 : 40,
    height: width < 380 ? 36 : 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-SemiBold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  quickActionSubtitle: {
    fontSize: width < 380 ? 11 : 12,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  categoriesContainer: {
    marginBottom: 25,
  },
  categoryCard: {
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  categoryCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width < 380 ? 12 : 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  categoryIcon: {
    width: width < 380 ? 36 : 40,
    height: width < 380 ? 36 : 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-Medium',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: width < 380 ? 11 : 12,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  newsCard: {
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  newsCardGradient: {
    padding: width < 380 ? 12 : 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  newsIcon: {
    width: width < 380 ? 36 : 40,
    height: width < 380 ? 36 : 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-Medium',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 18,
  },
  newsSummary: {
    fontSize: width < 380 ? 11 : 12,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    marginBottom: 4,
    lineHeight: 14,
  },
  newsDate: {
    fontSize: width < 380 ? 9 : 10,
    fontFamily: 'Rajdhani-Medium',
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 120,
  },
});