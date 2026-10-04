import React, { useCallback, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

const categoryNames: Record<string, string> = {
  general: 'General Knowledge',
  technology: 'Technology',
  science: 'Science',
  math: 'Mathematics',
  history: 'History',
  sports: 'Sports',
  geography: 'Geography',
  programming: 'Programming',
  entertainment: 'Entertainment',
  space: 'Space',
};

const categoryIcons: Record<string, string> = {
  general: '🧠',
  technology: '💻',
  science: '🔬',
  math: '➗',
  history: '📚',
  sports: '⚽',
  geography: '🌍',
  programming: '👨‍💻',
  entertainment: '🎬',
  space: '🚀',
};

export default function CategoryDetailsScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{
    category: string;
  }>();

  const [scores, setScores] = useState<number[]>([]);

  const categoryKey = category || 'general';

  const loadScores = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(
        `categoryHistory_${categoryKey}`
      );

      if (!saved) {
        setScores([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setScores(
          parsed.filter(
            (score) =>
              typeof score === 'number' &&
              Number.isFinite(score)
          )
        );
      }
    } catch {
      setScores([]);
    }
  }, [categoryKey]);

  useFocusEffect(
    useCallback(() => {
      loadScores();
    }, [loadScores])
  );

  const gamesPlayed = scores.length;

  const bestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  const averageScore =
    scores.length > 0
      ? Number(
          (
            scores.reduce(
              (total, score) => total + score,
              0
            ) / scores.length
          ).toFixed(1)
        )
      : 0;

  const accuracy =
    scores.length > 0
      ? Math.round(
          (scores.reduce(
            (total, score) => total + score,
            0
          ) /
            (scores.length * 5)) *
            100
        )
      : 0;

  const recentScores = [...scores]
    .slice(-5)
    .reverse();

  const medal =
    averageScore >= 5
      ? { icon: '💎', name: 'MASTER' }
      : averageScore >= 4
      ? { icon: '🥇', name: 'GOLD' }
      : averageScore >= 3
      ? { icon: '🥈', name: 'SILVER' }
      : averageScore >= 2
      ? { icon: '🥉', name: 'BRONZE' }
      : { icon: '🔒', name: 'LOCKED' };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.headerTitle}>
            <Text style={styles.categoryIcon}>
              {categoryIcons[categoryKey] || '🧠'}
            </Text>

            <Text style={styles.title}>
              {categoryNames[categoryKey] || 'Category'}
            </Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Your performance in this category
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎮</Text>
            <Text style={styles.statValue}>
              {gamesPlayed}
            </Text>
            <Text style={styles.statLabel}>
              Games
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>
              {bestScore}/5
            </Text>
            <Text style={styles.statLabel}>
              Best Score
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>
              {averageScore}/5
            </Text>
            <Text style={styles.statLabel}>
              Average
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>
              {accuracy}%
            </Text>
            <Text style={styles.statLabel}>
              Accuracy
            </Text>
          </View>
        </View>

        {medal && (
          <View style={styles.medalCard}>
            <Text style={styles.medalIcon}>
              {medal.icon}
            </Text>

            <View style={styles.medalText}>
              <Text style={styles.medalLabel}>
                CATEGORY MEDAL
              </Text>

              <Text style={styles.medalName}>
                {medal.name}
              </Text>

              <Text style={styles.medalDescription}>
                {medal.name === 'LOCKED'
                  ? 'Score 2/5 average to unlock Bronze.'
                  : medal.name === 'MASTER'
                  ? 'You have mastered this category!'
                  : 'Keep playing to reach the next medal.'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            RECENT SCORES
          </Text>

          <View style={styles.recentCard}>
            {recentScores.length > 0 ? (
              recentScores.map((score, index) => (
                <View
                  key={`${score}-${index}`}
                  style={styles.scoreRow}
                >
                  <Text style={styles.scoreNumber}>
                    Game {recentScores.length - index}
                  </Text>

                  <View style={styles.scoreBarTrack}>
                    <View
                      style={[
                        styles.scoreBarFill,
                        {
                          width:
                            `${(score / 5) * 100}%` as `${number}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.scoreValue}>
                    {score}/5
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>
                  🎯
                </Text>

                <Text style={styles.emptyTitle}>
                  No games yet
                </Text>

                <Text style={styles.emptyText}>
                  Play this category to start
                  tracking your performance.
                </Text>
              </View>
            )}
          </View>
        </View>

        <Pressable
          style={styles.playButton}
          onPress={() =>
            router.push({
              pathname: '/game',
              params: {
                category: categoryKey,
              },
            })
          }
        >
          <Text style={styles.playButtonText}>
            PLAY THIS CATEGORY
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  backText: {
    color: '#F8FAFC',
    fontSize: 34,
    lineHeight: 36,
  },

  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  categoryIcon: {
    fontSize: 28,
    marginRight: 10,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '900',
  },

  subtitle: {
    color: '#64748B',
    fontSize: 13,
    marginLeft: 56,
    marginBottom: 24,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
  },

  statIcon: {
    fontSize: 22,
    marginBottom: 8,
  },

  statValue: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '900',
  },

  statLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },

  medalCard: {
    marginTop: 20,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  medalIcon: {
    fontSize: 42,
    marginRight: 14,
  },

  medalText: {
    flex: 1,
  },

  medalLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  medalName: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 3,
  },

  medalDescription: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },

  recentCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    gap: 10,
  },

  scoreNumber: {
    width: 52,
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },

  scoreBarTrack: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },

  scoreBarFill: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#60A5FA',
  },

  scoreValue: {
    width: 32,
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'right',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },

  emptyText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },

  playButton: {
    marginTop: 24,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },

  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
