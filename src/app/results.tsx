import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
ScrollView,
StyleSheet,
Text,
TouchableOpacity,
View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function ResultsScreen() {
const { score, streak, category, daily } =
useLocalSearchParams<{
score?: string;
streak?: string;
category?: string;
daily?: string;
}>();

const [levelUp, setLevelUp] =
useState<number | null>(null);

const finalScore = Number(score || 0);
const finalStreak = Number(streak || 0);
const categoryName =
category || 'General Knowledge';

const isDaily = daily === 'true';

useEffect(() => {
const checkLevelUp = async () => {
try {
const savedLevel =
await AsyncStorage.getItem('levelUp');

    if (savedLevel) {
      setLevelUp(Number(savedLevel));

      await AsyncStorage.removeItem(
        'levelUp'
      );
    }
  } catch (error) {
    console.log(
      'Error checking level up:',
      error
    );
  }
};

checkLevelUp();

}, []);

const getScoreMessage = () => {
if (finalScore === 5) {
return {
emoji: '🔥',
title: 'PERFECT SCORE!',
subtitle: 'Outstanding brain power!',
};
}

if (finalScore >= 4) {
  return {
    emoji: '🎉',
    title: 'EXCELLENT!',
    subtitle: 'You are on fire!',
  };
}

if (finalScore >= 3) {
  return {
    emoji: '👏',
    title: 'GOOD JOB!',
    subtitle: 'Keep pushing your score higher.',
  };
}

if (finalScore >= 2) {
  return {
    emoji: '💪',
    title: 'KEEP PRACTICING!',
    subtitle: 'You are getting better.',
  };
}

return {
  emoji: '🚀',
  title: 'TRY AGAIN!',
  subtitle: 'Every game makes you sharper.',
};

};

const message = getScoreMessage();

return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.trophyCircle}>
          <Text style={styles.trophy}>🏆</Text>
        </View>

    <Text style={styles.title}>
      {isDaily
        ? 'Challenge Complete!'
        : 'Quiz Complete!'}
    </Text>

    <Text style={styles.subtitle}>
      {isDaily
        ? 'You completed today’s BrainRush challenge'
        : 'Here’s how you performed'}
    </Text>

    <View style={styles.categoryBadge}>
      <Text style={styles.categoryText}>
        {isDaily
          ? '📅  DAILY CHALLENGE'
          : `📚  ${categoryName.toUpperCase()}`}
      </Text>
    </View>
  </View>

  {/* SCORE CARD */}
  <View style={styles.scoreCard}>
    <Text style={styles.scoreLabel}>
      FINAL SCORE
    </Text>

    <View style={styles.scoreRow}>
      <Text style={styles.score}>
        {finalScore}
      </Text>

      <Text style={styles.scoreTotal}>
        / 5
      </Text>
    </View>

    <View style={styles.divider} />

    <Text style={styles.messageEmoji}>
      {message.emoji}
    </Text>

    <Text style={styles.scoreMessage}>
      {message.title}
    </Text>

    <Text style={styles.scoreSubtitle}>
      {message.subtitle}
    </Text>
  </View>

  {/* PERFORMANCE */}
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>
      YOUR PERFORMANCE
    </Text>
  </View>

  <View style={styles.statsRow}>
    <View style={styles.statCard}>
      <View style={styles.statIconCircle}>
        <Text style={styles.statEmoji}>
          🔥
        </Text>
      </View>

      <Text style={styles.statValue}>
        {finalStreak}
      </Text>

      <Text style={styles.statLabel}>
        Best Streak
      </Text>
    </View>

    <View style={styles.statCard}>
      <View style={styles.statIconCircle}>
        <Text style={styles.statEmoji}>
          ⭐
        </Text>
      </View>

      <Text style={styles.statValue}>
        {finalScore}
      </Text>

      <Text style={styles.statLabel}>
        Correct
      </Text>
    </View>
  </View>

  {/* ACTIONS */}
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>
      WHAT'S NEXT?
    </Text>
  </View>

  <TouchableOpacity
    style={styles.primaryButton}
    activeOpacity={0.85}
    onPress={() => {
      if (isDaily) {
        router.replace('/daily');
      } else {
        router.replace('/categories');
      }
    }}
  >
    <View style={styles.buttonIconCircle}>
      <Text style={styles.buttonIcon}>
        {isDaily ? '📅' : '🎮'}
      </Text>
    </View>

    <View style={styles.buttonContent}>
      <Text style={styles.primaryText}>
        {isDaily
          ? 'BACK TO DAILY'
          : 'PLAY AGAIN'}
      </Text>

      <Text style={styles.primarySubtext}>
        {isDaily
          ? 'Check your daily challenge'
          : 'Choose another category'}
      </Text>
    </View>

    <Text style={styles.buttonArrow}>
      ›
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionButton}
    activeOpacity={0.8}
    onPress={() =>
      router.replace('/review')
    }
  >
    <View style={styles.actionIconCircle}>
      <Text style={styles.actionIcon}>
        📖
      </Text>
    </View>

    <View style={styles.buttonContent}>
      <Text style={styles.actionTitle}>
        REVIEW ANSWERS
      </Text>

      <Text style={styles.actionSubtext}>
        See your answers and explanations
      </Text>
    </View>

    <Text style={styles.actionArrow}>
      ›
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionButton}
    activeOpacity={0.8}
    onPress={() =>
      router.replace('/leaderboard')
    }
  >
    <View style={styles.actionIconCircle}>
      <Text style={styles.actionIcon}>
        🏆
      </Text>
    </View>

    <View style={styles.buttonContent}>
      <Text style={styles.actionTitle}>
        VIEW LEADERBOARD
      </Text>

      <Text style={styles.actionSubtext}>
        See how you compare with others
      </Text>
    </View>

    <Text style={styles.actionArrow}>
      ›
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.homeButton}
    activeOpacity={0.8}
    onPress={() =>
      router.replace('/')
    }
  >
    <Text style={styles.homeButtonText}>
      🏠  BACK TO HOME
    </Text>
  </TouchableOpacity>

  <Text style={styles.footer}>
    BrainRush • Think Fast. Answer Faster.
  </Text>

  {/* LEVEL UP POPUP */}
  {levelUp && (
    <View style={styles.levelUpOverlay}>
      <View style={styles.levelUpCard}>
        <View style={styles.levelUpGlow}>
          <Text style={styles.levelUpEmoji}>
            🎉
          </Text>
        </View>

        <Text style={styles.levelUpTitle}>
          LEVEL UP!
        </Text>

        <Text style={styles.levelUpText}>
          Congratulations!
        </Text>

        <Text style={styles.levelUpDescription}>
          You’ve reached a new BrainRush level.
        </Text>

        <View style={styles.levelBadge}>
          <Text style={styles.levelLabel}>
            NEW LEVEL
          </Text>

          <Text style={styles.levelUpNumber}>
            {levelUp}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.levelUpButton}
          activeOpacity={0.85}
          onPress={() =>
            setLevelUp(null)
          }
        >
          <Text style={styles.levelUpButtonText}>
            AWESOME! 🚀
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
</ScrollView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#0F172A',
},

contentContainer: {
padding: 20,
paddingTop: 48,
paddingBottom: 35,
},

header: {
alignItems: 'center',
},

trophyCircle: {
width: 82,
height: 82,
borderRadius: 41,
backgroundColor: '#1E293B',
borderWidth: 2,
borderColor: '#334155',
alignItems: 'center',
justifyContent: 'center',
marginBottom: 14,
},

trophy: {
fontSize: 42,
},

title: {
color: '#FFFFFF',
fontSize: 28,
fontWeight: '900',
textAlign: 'center',
},

subtitle: {
color: '#94A3B8',
fontSize: 14,
textAlign: 'center',
marginTop: 7,
lineHeight: 20,
},

categoryBadge: {
backgroundColor: '#172554',
borderWidth: 1,
borderColor: '#2563EB',
borderRadius: 20,
paddingHorizontal: 15,
paddingVertical: 8,
marginTop: 14,
},

categoryText: {
color: '#60A5FA',
fontSize: 12,
fontWeight: '900',
letterSpacing: 0.5,
},

scoreCard: {
width: '100%',
backgroundColor: '#1E293B',
borderRadius: 24,
paddingVertical: 24,
paddingHorizontal: 20,
alignItems: 'center',
marginTop: 22,
borderWidth: 1,
borderColor: '#334155',
},

scoreLabel: {
color: '#64748B',
fontSize: 12,
fontWeight: '900',
letterSpacing: 1.5,
},

scoreRow: {
flexDirection: 'row',
alignItems: 'baseline',
marginTop: 2,
},

score: {
color: '#FFFFFF',
fontSize: 64,
fontWeight: '900',
},

scoreTotal: {
color: '#64748B',
fontSize: 26,
fontWeight: '800',
marginLeft: 4,
},

divider: {
width: '75%',
height: 1,
backgroundColor: '#334155',
marginVertical: 12,
},

messageEmoji: {
fontSize: 28,
},

scoreMessage: {
color: '#FBBF24',
fontSize: 20,
fontWeight: '900',
marginTop: 3,
},

scoreSubtitle: {
color: '#94A3B8',
fontSize: 13,
marginTop: 4,
},

sectionHeader: {
width: '100%',
marginTop: 22,
marginBottom: 10,
},

sectionTitle: {
color: '#64748B',
fontSize: 12,
fontWeight: '900',
letterSpacing: 1.4,
},

statsRow: {
width: '100%',
flexDirection: 'row',
justifyContent: 'space-between',
},

statCard: {
width: '48.5%',
backgroundColor: '#1E293B',
borderRadius: 20,
paddingVertical: 17,
alignItems: 'center',
borderWidth: 1,
borderColor: '#334155',
},

statIconCircle: {
width: 42,
height: 42,
borderRadius: 21,
backgroundColor: '#172554',
alignItems: 'center',
justifyContent: 'center',
},

statEmoji: {
fontSize: 21,
},

statValue: {
color: '#FFFFFF',
fontSize: 25,
fontWeight: '900',
marginTop: 7,
},

statLabel: {
color: '#94A3B8',
fontSize: 12,
fontWeight: '600',
marginTop: 2,
},

primaryButton: {
width: '100%',
minHeight: 72,
backgroundColor: '#2563EB',
borderRadius: 18,
paddingHorizontal: 15,
flexDirection: 'row',
alignItems: 'center',
marginBottom: 10,
},

buttonIconCircle: {
width: 44,
height: 44,
borderRadius: 22,
backgroundColor: 'rgba(255,255,255,0.15)',
alignItems: 'center',
justifyContent: 'center',
},

buttonIcon: {
fontSize: 20,
},

buttonContent: {
flex: 1,
marginLeft: 13,
},

primaryText: {
color: '#FFFFFF',
fontSize: 15,
fontWeight: '900',
},

primarySubtext: {
color: '#BFDBFE',
fontSize: 12,
marginTop: 3,
},

buttonArrow: {
color: '#FFFFFF',
fontSize: 30,
fontWeight: '300',
marginLeft: 8,
},

actionButton: {
width: '100%',
minHeight: 70,
backgroundColor: '#1E293B',
borderRadius: 18,
paddingHorizontal: 15,
flexDirection: 'row',
alignItems: 'center',
marginBottom: 10,
borderWidth: 1,
borderColor: '#334155',
},

actionIconCircle: {
width: 43,
height: 43,
borderRadius: 22,
backgroundColor: '#172554',
alignItems: 'center',
justifyContent: 'center',
},

actionIcon: {
fontSize: 20,
},

actionTitle: {
color: '#FFFFFF',
fontSize: 14,
fontWeight: '900',
},

actionSubtext: {
color: '#94A3B8',
fontSize: 12,
marginTop: 3,
},

actionArrow: {
color: '#60A5FA',
fontSize: 28,
marginLeft: 8,
},

homeButton: {
width: '100%',
backgroundColor: '#172554',
borderRadius: 17,
paddingVertical: 16,
alignItems: 'center',
borderWidth: 1,
borderColor: '#3B82F6',
marginTop: 2,
},

homeButtonText: {
color: '#60A5FA',
fontSize: 14,
fontWeight: '900',
},

footer: {
color: '#475569',
fontSize: 11,
textAlign: 'center',
marginTop: 22,
},

levelUpOverlay: {
position: 'absolute',
top: 0,
left: 0,
right: 0,
bottom: 0,
backgroundColor: 'rgba(2, 6, 23, 0.82)',
justifyContent: 'center',
alignItems: 'center',
padding: 22,
zIndex: 100,
},

levelUpCard: {
width: '100%',
backgroundColor: '#1E293B',
borderRadius: 28,
padding: 26,
alignItems: 'center',
borderWidth: 2,
borderColor: '#FBBF24',
},

levelUpGlow: {
width: 76,
height: 76,
borderRadius: 38,
backgroundColor: '#422006',
alignItems: 'center',
justifyContent: 'center',
marginBottom: 10,
},

levelUpEmoji: {
fontSize: 42,
},

levelUpTitle: {
color: '#FBBF24',
fontSize: 29,
fontWeight: '900',
letterSpacing: 1,
},

levelUpText: {
color: '#FFFFFF',
fontSize: 17,
fontWeight: '800',
marginTop: 7,
},

levelUpDescription: {
color: '#94A3B8',
fontSize: 13,
textAlign: 'center',
marginTop: 5,
},

levelBadge: {
minWidth: 120,
backgroundColor: '#172554',
borderRadius: 18,
paddingVertical: 11,
paddingHorizontal: 20,
alignItems: 'center',
marginTop: 18,
borderWidth: 1,
borderColor: '#3B82F6',
},

levelLabel: {
color: '#60A5FA',
fontSize: 10,
fontWeight: '900',
letterSpacing: 1,
},

levelUpNumber: {
color: '#FFFFFF',
fontSize: 32,
fontWeight: '900',
marginTop: 1,
},

levelUpButton: {
width: '100%',
backgroundColor: '#2563EB',
borderRadius: 15,
paddingVertical: 16,
alignItems: 'center',
marginTop: 20,
},

levelUpButtonText: {
color: '#FFFFFF',
fontSize: 15,
fontWeight: '900',
},
});