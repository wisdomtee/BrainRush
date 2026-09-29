import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [bestScore, setBestScore] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [playerXP, setPlayerXP] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);

  const loadData = useCallback(async () => {
    try {
      const values = await AsyncStorage.multiGet([
        'bestScore',
        'bestStreak',
        'gamesPlayed',
        'playerName',
        'playerXP',
      ]);

      const name = values[3][1];

      if (!name) {
        router.replace('/profile');
        return;
      }

      const savedXP = Number(values[4][1] || 0);

      setPlayerName(name);
      setBestScore(Number(values[0][1] || 0));
      setBestStreak(Number(values[1][1] || 0));
      setGamesPlayed(Number(values[2][1] || 0));
      setPlayerXP(savedXP);
      setPlayerLevel(Math.floor(savedXP / 100) + 1);
    } catch (error) {
      console.log('Error loading data:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const currentLevelXP = playerXP % 100;
  const xpToNextLevel = 100 - currentLevelXP;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>🧠</Text>
        </View>

        <Text style={styles.title}>BRAIN RUSH</Text>

        <Text style={styles.subtitle}>
          Think fast. Answer faster.
        </Text>
      </View>

      {/* PLAYER CARD */}
      <View style={styles.playerCard}>
        <View>
          <Text style={styles.smallLabel}>WELCOME BACK</Text>

          <Text style={styles.playerName}>
            {playerName} 👋
          </Text>
        </View>

        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>
            LV {playerLevel}
          </Text>
        </View>
      </View>

      {/* PLAY NOW */}
      <TouchableOpacity
        style={styles.playButton}
        activeOpacity={0.85}
        onPress={() => router.push('/categories')}
      >
        <View>
          <Text style={styles.playTitle}>
            PLAY NOW
          </Text>

          <Text style={styles.playSubtitle}>
            Choose a category and test your brain
          </Text>
        </View>

        <Text style={styles.playIcon}>▶</Text>
      </TouchableOpacity>

      {/* QUICK ACTIONS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          QUICK ACTIONS
        </Text>
      </View>

      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.8}
        onPress={() => router.push('/daily')}
      >
        <View style={styles.actionIcon}>
          <Text>📅</Text>
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            Daily Challenge
          </Text>

          <Text style={styles.actionDescription}>
            Complete today's challenge
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.8}
        onPress={() => router.push('/leaderboard')}
      >
        <View style={styles.actionIcon}>
          <Text>🏆</Text>
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            Leaderboard
          </Text>

          <Text style={styles.actionDescription}>
            See the top BrainRush players
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.8}
        onPress={() => router.push('/achievements')}
      >
        <View style={styles.actionIcon}>
          <Text>🏅</Text>
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            Achievements
          </Text>

          <Text style={styles.actionDescription}>
            View your unlocked badges
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* STATS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          YOUR STATS
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎯</Text>

          <Text style={styles.statValue}>
            {bestScore}/5
          </Text>

          <Text style={styles.statLabel}>
            Best Score
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>

          <Text style={styles.statValue}>
            {bestStreak}
          </Text>

          <Text style={styles.statLabel}>
            Best Streak
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎮</Text>

          <Text style={styles.statValue}>
            {gamesPlayed}
          </Text>

          <Text style={styles.statLabel}>
            Games
          </Text>
        </View>
      </View>

      {/* XP CARD */}
      <View style={styles.xpCard}>
        <View style={styles.xpHeader}>
          <View>
            <Text style={styles.smallLabel}>
              EXPERIENCE
            </Text>

            <Text style={styles.xpTitle}>
              Level {playerLevel}
            </Text>
          </View>

          <Text style={styles.xpAmount}>
            ⭐ {playerXP} XP
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
  style={[
    styles.progressFill,
    {
      width: currentLevelXP + '%',
    },
  ]}
/>
        </View>

        <View style={styles.xpBottomRow}>
          <Text style={styles.progressText}>
            {currentLevelXP}/100 XP
          </Text>

          <Text style={styles.nextLevelText}>
            {xpToNextLevel} XP to next level
          </Text>
        </View>
      </View>

      {/* CHANGE PLAYER */}
      <TouchableOpacity
        style={styles.profileButton}
        activeOpacity={0.8}
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.profileText}>
          👤  Change Player
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        BrainRush • Think Fast. Answer Faster.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08111F',
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 25,
  },

  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#172554',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2563EB',
  },

  logo: {
    fontSize: 45,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 6,
  },

  playerCard: {
    backgroundColor: '#111D2E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  smallLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  playerName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },

  levelBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  playButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  playTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  playSubtitle: {
    color: '#DBEAFE',
    fontSize: 12,
    marginTop: 4,
  },

  playIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },

  sectionHeader: {
    marginBottom: 10,
    marginTop: 2,
  },

  sectionTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  actionCard: {
    backgroundColor: '#111D2E',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#172554',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionContent: {
    flex: 1,
    marginLeft: 13,
  },

  actionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  actionDescription: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 3,
  },

  arrow: {
    color: '#64748B',
    fontSize: 28,
    marginLeft: 8,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  statCard: {
    width: '31.5%',
    backgroundColor: '#111D2E',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  statIcon: {
    fontSize: 20,
    marginBottom: 5,
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },

  statLabel: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },

  xpCard: {
    backgroundColor: '#111D2E',
    borderRadius: 20,
    padding: 18,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  xpTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },

  xpAmount: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '900',
  },

  progressBackground: {
    width: '100%',
    height: 9,
    backgroundColor: '#08111F',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },

  xpBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },

  progressText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },

  nextLevelText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },

  profileButton: {
    alignItems: 'center',
    paddingVertical: 18,
  },

  profileText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: '800',
  },

  footer: {
    color: '#334155',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  },
});
