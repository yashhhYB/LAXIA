import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Award, Flame, Bell, MapPin, Mic, Download, Settings, ChevronRight, CreditCard as Edit3, Shield, TrendingUp } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [voiceAssistant, setVoiceAssistant] = useState(false);

  const stats = [
    { title: 'Laws Learned', value: '47', icon: <Shield size={20} color="#007AFF" />, color: '#007AFF' },
    { title: 'Quiz Score', value: '85%', icon: <TrendingUp size={20} color="#34C759" />, color: '#34C759' },
    { title: 'Study Streak', value: '12', icon: <Flame size={20} color="#FF9500" />, color: '#FF9500' },
  ];

  const settings = [
    {
      title: 'Notifications',
      subtitle: 'Legal updates and reminders',
      icon: <Bell size={20} color="#8E8E93" />,
      value: notifications,
      onToggle: setNotifications,
      type: 'toggle'
    },
    {
      title: 'Location Services',
      subtitle: 'For local law recommendations',
      icon: <MapPin size={20} color="#8E8E93" />,
      value: location,
      onToggle: setLocation,
      type: 'toggle'
    },
    {
      title: 'Voice Assistant',
      subtitle: 'Enable voice interactions',
      icon: <Mic size={20} color="#8E8E93" />,
      value: voiceAssistant,
      onToggle: setVoiceAssistant,
      type: 'toggle'
    },
  ];

  const actions = [
    { title: 'Download Legal Templates', subtitle: 'Offline access to forms', icon: <Download size={20} color="#8E8E93" /> },
    { title: 'App Settings', subtitle: 'Preferences and privacy', icon: <Settings size={20} color="#8E8E93" /> },
    { title: 'Help & Support', subtitle: 'Get assistance', icon: <Shield size={20} color="#8E8E93" /> },
  ];

  const achievements = [
    { title: 'Legal Scholar', description: 'Completed 10 law categories', earned: true },
    { title: 'Quiz Master', description: 'Scored 90%+ in 5 quizzes', earned: true },
    { title: 'Streak Champion', description: '30-day learning streak', earned: false },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={20} color="#00D4FF" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userContainer}>
            <View style={styles.avatar}>
              <User size={32} color="#00D4FF" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Legal Explorer</Text>
              <Text style={styles.userType}>General Awareness User</Text>
              <Text style={styles.joinDate}>Member since Jan 2024</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  {stat.icon}
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <View key={index} style={[styles.achievementCard, !achievement.earned && styles.achievementCardLocked]}>
                <View style={styles.achievementContent}>
                  <Award size={20} color={achievement.earned ? "#FFD700" : "#8E8E93"} />
                  <View style={styles.achievementText}>
                    <Text style={[styles.achievementTitle, !achievement.earned && styles.achievementTitleLocked]}>
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  </View>
                </View>
                {achievement.earned && <View style={styles.earnedBadge} />}
              </View>
            ))}
          </View>

          {/* Settings */}
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            {settings.map((setting, index) => (
              <View key={index} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  {setting.icon}
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                  </View>
                </View>
                <Switch
                  value={setting.value}
                  onValueChange={setting.onToggle}
                  trackColor={{ false: '#2C2C2E', true: '#00D4FF40' }}
                  thumbColor={setting.value ? '#00D4FF' : '#8E8E93'}
                />
              </View>
            ))}
          </View>

          {/* Actions */}
          <Text style={styles.sectionTitle}>More Options</Text>
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard}>
                <View style={styles.actionLeft}>
                  {action.icon}
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#8E8E93" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00D4FF20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00D4FF',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#00D4FF',
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    fontFamily: 'Rajdhani-Regular',
    color: '#8E8E93',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Rajdhani-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  achievementsContainer: {
    marginBottom: 30,
  },
  achievementCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    position: 'relative',
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-Regular',
    color: '#fff',
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: '#8E8E93',
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Rajdhani-Regular',
    color: '#8E8E93',
  },
  earnedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  settingsContainer: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-Regular',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: 'Rajdhani-Regular',
    color: '#8E8E93',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron-Regular',
    color: '#fff',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Rajdhani-Regular',
    color: '#8E8E93',
  },
  bottomSpacing: {
    height: 100,
  },
});