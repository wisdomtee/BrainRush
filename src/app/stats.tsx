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
import { useFocusEffect, useRouter } from 'expo-router';

const getNumber = (
  value: string | null,
  fallback = 0
) => {

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const categories = [
  {
    key: 'general',
    name: 'General Knowledge',
    icon: '🧠',
  },
  {
    key: 'technology',
    name: 'Technology',
    icon: '💻',
  },
  {
    key: 'science',
    name: 'Science',
    icon: '🔬',
  },
  {
    key: 'math',
    name: 'Mathematics',
    icon: '➗',
  },
  {
    key: 'history',
    name: 'History',
    icon: '📚',
  },
  {
    key: 'sports',
    name: 'Sports',
    icon: '⚽',
  },
  {
    key: 'geography',
    name: 'Geography',
    icon: '🌍',
  },
  {
    key: 'programming',
    name: 'Programming',
    icon: '👨‍💻',
  },
  {
    key: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
  },
  {
    key: 'space',
    name: 'Space',
    icon: '🚀',
  },
];

export default function StatsScreen() {
  const router = useRouter();

  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [categoryScores, setCategoryScores] =
  useState<Record<string, number>>({});

  const categoryEntries = categories
    .map((category) => ({
      ...category,
      score: categoryScores[category.key] || 0,
    }))
    .filter((category) => category.score > 0);

  const strongestCategory =
    categoryEntries.length > 0
      ? categoryEntries.reduce((best, current) =>
          current.score > best.score
            ? current
            : best
        )
      : null;

  const weakestCategory =
    categoryEntries.length > 0
      ? categoryEntries.reduce((weakest, current) =>
          current.score < weakest.score
            ? current
            : weakest
        )
      : null;

  const loadStats = useCallback(async () => {
    try {
      const [
        savedGames,
        savedBestScore,
        savedBestStreak,
        savedXP,
        savedLevel,
        savedAchievements,
        savedScoreHistory,
      ] = await Promise.all([
        AsyncStorage.getItem('gamesPlayed'),
        AsyncStorage.getItem('bestScore'),
        AsyncStorage.getItem('bestStreak'),
        AsyncStorage.getItem('playerXP'),
        AsyncStorage.getItem('playerLevel'),
        AsyncStorage.getItem('achievements'),
        AsyncStorage.getItem('scoreHistory'),
        AsyncStorage.getItem('categoryHistory_general'),
        AsyncStorage.getItem('categoryHistory_technology'),
        AsyncStorage.getItem('categoryHistory_science'),
        AsyncStorage.getItem('categoryHistory_math'),
        AsyncStorage.getItem('categoryHistory_history'),
        AsyncStorage.getItem('categoryHistory_sports'),
        AsyncStorage.getItem('categoryHistory_geography'),
        AsyncStorage.getItem('categoryHistory_programming'),
        AsyncStorage.getItem('categoryHistory_entertainment'),
        AsyncStorage.getItem('categoryHistory_space'),
      ]);

      const categoryResults =
  await Promise.all(
    categories.map((category) =>
      AsyncStorage.getItem(
        `categoryHistory_${category.key}`
      )
    )
  );

const loadedCategoryScores:
  Record<string, number> = {};

categories.forEach(
  (category, index) => {
    const saved =
      categoryResults[index];

    if (!saved) {
      loadedCategoryScores[
        category.key
      ] = 0;

      return;
    }

    try {
      const scores =
        JSON.parse(saved);

      if (
        Array.isArray(scores) &&
        scores.length > 0
      ) {
        const total = scores.reduce(
          (
            sum: number,
            score: number
          ) => sum + score,
          0
        );

        loadedCategoryScores[
          category.key
        ] = Number(
          (
            total / scores.length
          ).toFixed(1)
        );
      } else {
        loadedCategoryScores[
          category.key
        ] = 0;
      }
    } catch {
      loadedCategoryScores[
        category.key
      ] = 0;
    }
  }
);

setCategoryScores(
  loadedCategoryScores
);

      const loadedGames = getNumber(savedGames);

      setGamesPlayed(loadedGames);

      setBestScore(
        getNumber(savedBestScore)
      );

      setBestStreak(
        getNumber(savedBestStreak)
      );

      setXp(
        getNumber(savedXP)
      );

      setLevel(
        Math.max(
          1,
          getNumber(savedLevel, 1)
        )
      );

      if (savedAchievements) {
        try {
          const parsed =
            JSON.parse(savedAchievements);

          if (Array.isArray(parsed)) {
            setAchievements(parsed.length);
          } else if (
            parsed &&
            typeof parsed === 'object'
          ) {
            setAchievements(
              Object.values(parsed).filter(
                Boolean
              ).length
            );
          }
        } catch {
          setAchievements(0);
        }
      }

      if (savedScoreHistory) {
        try {
          const parsed =
            JSON.parse(savedScoreHistory);

          if (
            Array.isArray(parsed) &&
            parsed.length > 0
          ) {
            const validScores =
              parsed.filter(
                (score) =>
                  typeof score === 'number' &&
                  Number.isFinite(score)
              );

            if (validScores.length > 0) {
              const totalScore =
                validScores.reduce(
                  (total, score) =>
                    total + score,
                  0
                );

              const average =
                totalScore /
                validScores.length;

              setAverageScore(
                Number(average.toFixed(1))
              );

              const totalCorrect =
                totalScore;

              const totalQuestions =
                validScores.length * 5;

              const calculatedAccuracy =
                totalQuestions > 0
                  ? (totalCorrect /
                      totalQuestions) *
                    100
                  : 0;

              setAccuracy(
                Math.round(
                  calculatedAccuracy
                )
              );
            }
          }
        } catch {
          setAverageScore(0);
          setAccuracy(0);
        }
      }
    } catch (error) {
      console.log(
        'Failed to load stats:',
        error
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const xpPerLevel = 100;
  const currentLevelXP =
    xp % xpPerLevel;

  const xpProgress =
    currentLevelXP / xpPerLevel;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <View>
            <Text style={styles.title}>
              Your Stats
            </Text>

            <Text style={styles.subtitle}>
              Track your BrainRush progress
            </Text>
          </View>
        </View>

        {/* LEVEL */}
        <View style={styles.levelCard}>
          <View style={styles.levelTop}>
            <View>
              <Text style={styles.levelLabel}>
                CURRENT LEVEL
              </Text>

              <Text style={styles.levelNumber}>
                Level {level}
              </Text>
            </View>

            <Text style={styles.xpValue}>
              {xp} XP
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    100,
                    xpProgress * 100
                  )}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {currentLevelXP} / {xpPerLevel} XP
            to next level
          </Text>
        </View>

        {/* STATS GRID */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              🎮
            </Text>

            <Text style={styles.statValue}>
              {gamesPlayed}
            </Text>

            <Text style={styles.statLabel}>
              Games Played
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              ⭐
            </Text>

            <Text style={styles.statValue}>
              {bestScore}
            </Text>

            <Text style={styles.statLabel}>
              Best Score
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              📊
            </Text>

            <Text style={styles.statValue}>
              {averageScore}/5
            </Text>

            <Text style={styles.statLabel}>
              Average Score
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              🎯
            </Text>

            <Text style={styles.statValue}>
              {accuracy}%
            </Text>

            <Text style={styles.statLabel}>
              Accuracy
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              🔥
            </Text>

            <Text style={styles.statValue}>
              {bestStreak}
            </Text>

            <Text style={styles.statLabel}>
              Best Streak
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              🏆
            </Text>

            <Text style={styles.statValue}>
              {achievements}
            </Text>

            <Text style={styles.statLabel}>
              Achievements
            </Text>
          </View>
        </View>

        {/* PERFORMANCE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            PERFORMANCE
          </Text>

          <View style={styles.performanceCard}>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Games completed
              </Text>

              <Text style={styles.performanceValue}>
                {gamesPlayed}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Highest score
              </Text>

              <Text style={styles.performanceValue}>
                {bestScore} / 5
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Average score
              </Text>

              <Text style={styles.performanceValue}>
                {averageScore} / 5
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Accuracy
              </Text>

              <Text style={styles.performanceValue}>
                {accuracy}%
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Longest streak
              </Text>

              <Text style={styles.performanceValue}>
                {bestStreak}
              </Text>
            </View>
          </View>
        </View>

        {/* CATEGORY PERFORMANCE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            CATEGORY PERFORMANCE
          </Text>

          <View style={styles.categoryCard}>
            {categories.map((category) => {
              const score =
                categoryScores[category.key] || 0;
              const progress =
                Math.min(score / 5, 1) * 100;

              return (
                <Pressable
                  key={category.key}
                  style={styles.categoryRow}
                  onPress={() =>
                    router.push({
                      pathname: '/category-details',
                      params: {
                        category: category.key,
                      },
                    })
                  }
                >
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryIcon}>
                        {category.icon}
                      </Text>

                      <Text style={styles.categoryName}>
                        {category.name}
                      </Text>
                    </View>

                    <View style={styles.categoryScoreArea}>
                      <Text style={styles.categoryScore}>
                        {score}/5
                      </Text>

                      <Text style={styles.categoryMedal}>
                        {score >= 5
                          ? '💎'
                          : score >= 4
                          ? '🥇'
                          : score >= 3
                          ? '🥈'
                          : score >= 2
                          ? '🥉'
                          : '🔒'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        {
                          width: `${progress}%` as `${number}%`,
                        },
                      ]}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.categoryInsights}>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>
              STRONGEST CATEGORY
            </Text>

            <View style={styles.insightContent}>
              <Text style={styles.insightIcon}>
                {strongestCategory?.icon || '🏆'}
              </Text>

              <View style={styles.insightText}>
                <Text style={styles.insightName}>
                  {strongestCategory?.name || 'Play more games'}
                </Text>

                <Text style={styles.insightScore}>
                  {strongestCategory
                    ? strongestCategory.score + '/5 average'
                    : 'No data yet'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>
              CATEGORY TO IMPROVE
            </Text>

            <View style={styles.insightContent}>
              <Text style={styles.insightIcon}>
                {weakestCategory?.icon || '🎯'}
              </Text>

              <View style={styles.insightText}>
                <Text style={styles.insightName}>
                  {weakestCategory?.name || 'Play more games'}
                </Text>

                <Text style={styles.insightScore}>
                  {weakestCategory
                    ? weakestCategory.score + '/5 average'
                    : 'No data yet'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            QUICK ACTIONS
          </Text>

          <Pressable
            style={styles.actionButton}
            onPress={() =>
              router.push('/achievements')
            }
          >
            <Text style={styles.actionIcon}>
              🏆
            </Text>

            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>
                View Achievements
              </Text>

              <Text style={styles.actionDescription}>
                See your unlocked badges
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() =>
              router.push('/leaderboard')
            }
          >
            <Text style={styles.actionIcon}>
              🥇
            </Text>

            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>
                View Leaderboard
              </Text>

              <Text style={styles.actionDescription}>
                Check your ranking
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 28,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    marginRight: 14,
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 36,
    marginTop: -4,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },

  levelCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  levelTop: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  levelLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  levelNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },

  xpValue: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: '800',
  },

  progressBackground: {
    height: 9,
    backgroundColor: '#1E293B',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 18,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 5,
  },

  progressText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 8,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 10,
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  statLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },

  section: {
    marginBottom: 26,
  },

  sectionTitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  performanceCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    paddingHorizontal: 18,
  },

  performanceRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  performanceLabel: {
    color: '#CBD5E1',
    fontSize: 14,
  },

  performanceValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#1E293B',
  },

  actionButton: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  actionIcon: {
    fontSize: 22,
    marginRight: 12,
  },

  actionText: {
    flex: 1,
  },

  actionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  actionDescription: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 3,
  },

  arrow: {
    color: '#64748B',
    fontSize: 28,
  },

    categoryCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    paddingHorizontal: 18,
  },

  categoryRow: {
    minHeight: 70,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  progressTrack: {
    height: 6,
    marginTop: 8,
    borderRadius: 3,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },

  categoryProgressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#60A5FA',
  },

  categoryInsights: {
    marginTop: 14,
    gap: 12,
  },

  insightCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
  },

  insightLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },

  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  insightIcon: {
    fontSize: 28,
    marginRight: 12,
  },

  insightText: {
    flex: 1,
  },

  insightName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },

  insightScore: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  categoryName: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },

  categoryScoreArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  categoryScore: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '800',
  },

  categoryMedal: {
    fontSize: 18,
  },
});