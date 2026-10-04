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

type Achievement = {
id: string;
title: string;
description: string;
emoji: string;
};

const achievements: Achievement[] = [
  {
    id: 'first_game',
    title: 'First Game',
    description: 'Complete your first quiz.',
    emoji: '🎮',
  },
  {
    id: 'hot_streak',
    title: 'Hot Streak',
    description: 'Get 3 correct answers in a row.',
    emoji: '🔥',
  },
  {
    id: 'brain_master',
    title: 'Brain Master',
    description: 'Score 5 out of 5 in a quiz.',
    emoji: '🧠',
  },
  {
    id: 'perfect_player',
    title: 'Perfect Player',
    description: 'Complete a perfect quiz.',
    emoji: '🎯',
  },
  {
    id: 'knowledge_seeker',
    title: 'Category Explorer',
    description: 'Play all 10 quiz categories.',
    emoji: '🧭',
  },
  {
    id: 'category_specialist',
    title: 'Category Specialist',
    description: 'Reach a 4/5 average in a category.',
    emoji: '🔥',
  },
  {
    id: 'category_master',
    title: 'Category Master',
    description: 'Reach a 5/5 average in a category.',
    emoji: '💎',
  },
  {
    id: 'all_rounder',
    title: 'All-Rounder',
    description: 'Reach a 3/5 average across all 10 categories.',
    emoji: '🌍',
  },
  {
    id: 'daily_champion',
    title: 'Daily Champion',
    description: 'Complete a Daily Challenge.',
    emoji: '📅',
  },
  {
    id: 'quiz_veteran',
    title: 'Quiz Veteran',
    description: 'Complete 10 quizzes.',
    emoji: '🏆',
  },
];

export default function AchievementsScreen() {
const [unlocked, setUnlocked] =
useState<string[]>([]);

const [playedCategories, setPlayedCategories] =
useState<string[]>([]);

const loadAchievements = useCallback(
  async () => {
    try {
      const saved =
        await AsyncStorage.getItem(
          'achievements'
        );

      if (saved) {
        setUnlocked(JSON.parse(saved));
      } else {
        setUnlocked([]);
      }

      const savedCategories =
        await AsyncStorage.getItem(
          'playedCategories'
        );

      if (savedCategories) {
        setPlayedCategories(
          JSON.parse(savedCategories)
        );
      } else {
        setPlayedCategories([]);
      }
    } catch (error) {
      console.log(
        'Error loading achievements:',
        error
      );
    }
  },
  []
);

useFocusEffect(
useCallback(() => {
loadAchievements();
}, [loadAchievements])
);

const unlockedCount = achievements.filter(
(achievement) =>
unlocked.includes(achievement.id)
).length;

const progressPercentage =
(unlockedCount / achievements.length) * 100;

return ( <View style={styles.container}>
{/* HEADER */} <View style={styles.header}>
<TouchableOpacity
style={styles.backButton}
activeOpacity={0.8}
onPress={() => router.back()}
> <Text style={styles.back}>
‹ </Text> </TouchableOpacity>
    <View style={styles.headerCenter}>
      <Text style={styles.headerTitle}>
        ACHIEVEMENTS
      </Text>

      <Text style={styles.headerSubtitle}>
        BRAIN RUSH BADGES
      </Text>
    </View>

    <View style={styles.headerSpace} />
  </View>

  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.content}
  >
    {/* HERO */}
    <View style={styles.hero}>
      <View style={styles.badgeCircle}>
        <Text style={styles.badgeEmoji}>
          🏅
        </Text>
      </View>

      <Text style={styles.title}>
        Your Achievements
      </Text>

      <Text style={styles.subtitle}>
        Unlock badges as you master BrainRush.
      </Text>
    </View>

    {/* PROGRESS CARD */}
    <View style={styles.progressCard}>
      <View style={styles.progressTop}>
        <View>
          <Text style={styles.progressLabel}>
            ACHIEVEMENT PROGRESS
          </Text>
          <Text style={styles.progressTitle}>
            {unlockedCount} of{' '}
            {achievements.length} unlocked
          </Text>
        </View>

        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
      </View>

      <View style={styles.progressBackground}>
        <View style={{ width: `${progressPercentage}%` as `${number}%` }} />
      </View>

      <View style={styles.categoryProgress}>
        <View style={styles.categoryProgressTop}>
          <Text style={styles.categoryProgressText}>
            {Math.min(playedCategories.length, 10)}/10 categories played
          </Text>
          <Text style={styles.categoryProgressPercent}>
            {Math.round((Math.min(playedCategories.length, 10) / 10) * 100)}%
          </Text>
        </View>

        <View style={styles.categoryProgressTrack}>
          <View
            style={[
              styles.categoryProgressFill,
              {
                width: `${Math.min(playedCategories.length, 10) * 10}%` as `${number}%`,
              },
            ]}
          />
        </View>
      </View>

      <Text style={styles.progressHint}>
        Keep playing to unlock them all!
      </Text>
    </View>

    {/* ACHIEVEMENT LIST */}
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        ALL BADGES
      </Text>

      <Text style={styles.countText}>
        {unlockedCount}/{achievements.length}
      </Text>
    </View>

    {achievements.map(
      (achievement, index) => {
        const isUnlocked =
          unlocked.includes(
            achievement.id
          );

        return (
          <View
            key={achievement.id}
            style={[
              styles.card,
              isUnlocked
                ? styles.unlockedCard
                : styles.lockedCard,
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                isUnlocked
                  ? styles.unlockedIcon
                  : styles.lockedIcon,
              ]}
            >
              <Text
                style={[
                  styles.emoji,
                  !isUnlocked &&
                    styles.lockedEmoji,
                ]}
              >
                {isUnlocked
                  ? achievement.emoji
                  : '🔒'}
              </Text>
            </View>

            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.badgeTitle,
                    !isUnlocked &&
                      styles.lockedText,
                  ]}
                >
                  {achievement.title}
                </Text>

                {isUnlocked && (
                  <View
                    style={styles.unlockedPill}
                  >
                    <Text
                      style={
                        styles.unlockedPillText
                      }
                    >
                      ✓
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.description,
                  !isUnlocked &&
                    styles.lockedDescription,
                ]}
              >
                {achievement.description}
              </Text>

              <View
                style={[
                  styles.statusContainer,
                  isUnlocked
                    ? styles.unlockedStatusContainer
                    : styles.lockedStatusContainer,
                ]}
              >
                <Text
                  style={[
                    styles.status,
                    isUnlocked
                      ? styles.unlockedStatus
                      : styles.lockedStatus,
                  ]}
                >
                  {isUnlocked
                    ? 'UNLOCKED'
                    : 'LOCKED'}
                </Text>
              </View>
            </View>
          </View>
        );
      }
    )}

    {/* MOTIVATION CARD */}
    <View style={styles.motivationCard}>
      <Text style={styles.motivationEmoji}>
        🧠
      </Text>

      <View style={styles.motivationContent}>
        <Text style={styles.motivationTitle}>
          Keep pushing!
        </Text>

        <Text style={styles.motivationText}>
          Every quiz brings you closer to
          unlocking your next badge.
        </Text>
      </View>
    </View>

    {/* HOME */}
    <TouchableOpacity
      style={styles.homeButton}
      activeOpacity={0.85}
      onPress={() =>
        router.replace('/')
      }
    >
      <Text style={styles.homeText}>
        🏠  BACK TO HOME
      </Text>
    </TouchableOpacity>

    <Text style={styles.footer}>
      BrainRush • Think Fast. Answer Faster.
    </Text>
  </ScrollView>
</View>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#0F172A',
},

header: {
height: 70,
paddingHorizontal: 20,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
borderBottomWidth: 1,
borderBottomColor: '#1E293B',
},

backButton: {
width: 42,
height: 42,
borderRadius: 21,
backgroundColor: '#1E293B',
alignItems: 'center',
justifyContent: 'center',
borderWidth: 1,
borderColor: '#334155',
},

back: {
color: '#FFFFFF',
fontSize: 34,
lineHeight: 36,
marginTop: -4,
},

headerCenter: {
alignItems: 'center',
},

headerTitle: {
color: '#FFFFFF',
fontSize: 17,
fontWeight: '900',
letterSpacing: 1,
},

headerSubtitle: {
color: '#64748B',
fontSize: 9,
fontWeight: '800',
letterSpacing: 1.2,
marginTop: 2,
},

headerSpace: {
width: 42,
},

content: {
paddingHorizontal: 20,
paddingTop: 28,
paddingBottom: 35,
},

hero: {
alignItems: 'center',
},

badgeCircle: {
width: 88,
height: 88,
borderRadius: 44,
backgroundColor: '#1E293B',
borderWidth: 2,
borderColor: '#FBBF24',
alignItems: 'center',
justifyContent: 'center',
},

badgeEmoji: {
fontSize: 44,
},

title: {
color: '#FFFFFF',
fontSize: 27,
fontWeight: '900',
textAlign: 'center',
marginTop: 16,
},

subtitle: {
color: '#94A3B8',
fontSize: 14,
textAlign: 'center',
marginTop: 6,
lineHeight: 20,
},

progressCard: {
backgroundColor: '#1E293B',
borderRadius: 20,
padding: 17,
marginTop: 22,
borderWidth: 1,
borderColor: '#334155',
},

progressTop: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
},

progressLabel: {
color: '#64748B',
fontSize: 10,
fontWeight: '900',
letterSpacing: 1.2,
},

progressTitle: {
color: '#FFFFFF',
fontSize: 17,
fontWeight: '900',
marginTop: 4,
},

progressBadge: {
minWidth: 55,
height: 40,
paddingHorizontal: 9,
borderRadius: 14,
backgroundColor: '#172554',
borderWidth: 1,
borderColor: '#3B82F6',
alignItems: 'center',
justifyContent: 'center',
},

progressBadgeText: {
color: '#60A5FA',
fontSize: 14,
fontWeight: '900',
},

progressBackground: {
height: 9,
backgroundColor: '#0F172A',
borderRadius: 5,
overflow: 'hidden',
marginTop: 15,
},

progressFill: {
height: '100%',
backgroundColor: '#2563EB',
borderRadius: 5,
},

progressHint: {
color: '#64748B',
fontSize: 11,
marginTop: 8,
},

sectionHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginTop: 24,
marginBottom: 10,
},

sectionTitle: {
color: '#64748B',
fontSize: 11,
fontWeight: '900',
letterSpacing: 1.3,
},

countText: {
color: '#475569',
fontSize: 11,
fontWeight: '800',
},

card: {
width: '100%',
flexDirection: 'row',
alignItems: 'center',
borderRadius: 19,
padding: 15,
marginBottom: 11,
borderWidth: 1,
},

unlockedCard: {
backgroundColor: '#172554',
borderColor: '#3B82F6',
},

lockedCard: {
backgroundColor: '#1E293B',
borderColor: '#334155',
opacity: 0.72,
},

iconContainer: {
width: 62,
height: 62,
borderRadius: 18,
justifyContent: 'center',
alignItems: 'center',
marginRight: 14,
},

unlockedIcon: {
backgroundColor: '#0F172A',
borderWidth: 1,
borderColor: '#2563EB',
},

lockedIcon: {
backgroundColor: '#111827',
borderWidth: 1,
borderColor: '#334155',
},

emoji: {
fontSize: 32,
},

lockedEmoji: {
fontSize: 25,
},

info: {
flex: 1,
},

titleRow: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
},

badgeTitle: {
color: '#FFFFFF',
fontSize: 16,
fontWeight: '900',
flex: 1,
},

lockedText: {
color: '#94A3B8',
},

unlockedPill: {
width: 25,
height: 25,
borderRadius: 13,
backgroundColor: '#14532D',
alignItems: 'center',
justifyContent: 'center',
marginLeft: 8,
},

unlockedPillText: {
color: '#4ADE80',
fontSize: 13,
fontWeight: '900',
},

description: {
color: '#CBD5E1',
fontSize: 12,
lineHeight: 18,
marginTop: 4,
},

lockedDescription: {
color: '#64748B',
},

statusContainer: {
alignSelf: 'flex-start',
borderRadius: 8,
paddingHorizontal: 8,
paddingVertical: 4,
marginTop: 7,
},

unlockedStatusContainer: {
backgroundColor: '#14532D',
},

lockedStatusContainer: {
backgroundColor: '#0F172A',
},

status: {
fontSize: 9,
fontWeight: '900',
letterSpacing: 0.7,
},

unlockedStatus: {
color: '#4ADE80',
},

lockedStatus: {
color: '#64748B',
},

categoryProgress: {
marginTop: 12,
},

categoryProgressTop: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 6,
},

categoryProgressText: {
fontSize: 12,
fontWeight: '600',
color: '#64748B',
},

categoryProgressPercent: {
fontSize: 12,
fontWeight: '700',
color: '#2563EB',
},

categoryProgressTrack: {
height: 7,
borderRadius: 4,
backgroundColor: '#E2E8F0',
overflow: 'hidden',
},

categoryProgressFill: {
height: '100%',
borderRadius: 4,
backgroundColor: '#2563EB',
},

motivationCard: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#172554',
borderRadius: 19,
borderWidth: 1,
borderColor: '#263B67',
padding: 16,
marginTop: 8,
},

motivationEmoji: {
fontSize: 31,
marginRight: 13,
},

motivationContent: {
flex: 1,
},

motivationTitle: {
color: '#FFFFFF',
fontSize: 14,
fontWeight: '900',
},

motivationText: {
color: '#94A3B8',
fontSize: 12,
lineHeight: 18,
marginTop: 3,
},

homeButton: {
width: '100%',
backgroundColor: '#2563EB',
borderRadius: 17,
paddingVertical: 16,
alignItems: 'center',
marginTop: 18,
},

homeText: {
color: '#FFFFFF',
fontSize: 14,
fontWeight: '900',
},

footer: {
color: '#475569',
fontSize: 11,
textAlign: 'center',
marginTop: 22,
},
});
