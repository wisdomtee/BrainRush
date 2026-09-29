import React, { useCallback, useState } from 'react';
import {
SafeAreaView,
ScrollView,
View,
Text,
StyleSheet,
TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getTodayKey = () => {
const date = new Date();

return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export default function DailyScreen() {
const router = useRouter();

const [completed, setCompleted] = useState(false);

const checkDailyChallenge = useCallback(async () => {
try {
const lastPlayed =
await AsyncStorage.getItem('dailyChallengeDate');

  setCompleted(lastPlayed === getTodayKey());
} catch (error) {
  console.log(
    'Failed to check daily challenge:',
    error
  );
}

}, []);

useFocusEffect(
useCallback(() => {
checkDailyChallenge();
}, [checkDailyChallenge])
);

const startChallenge = async () => {
try {
await AsyncStorage.setItem(
'dailyChallengeStarted',
getTodayKey()
);
  router.push('/daily-game');
} catch (error) {
  console.log(
    'Failed to start daily challenge:',
    error
  );
}

};

return ( <SafeAreaView style={styles.container}> <ScrollView
     showsVerticalScrollIndicator={false}
     contentContainerStyle={styles.content}
   > <View style={styles.header}>
<TouchableOpacity
style={styles.backButton}
activeOpacity={0.8}
onPress={() => router.back()}
> <Text style={styles.backText}>‹</Text> </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>
          DAILY CHALLENGE
        </Text>

        <Text style={styles.headerSubtitle}>
          ONE CHALLENGE. EVERY DAY.
        </Text>
      </View>

      <View style={styles.headerSpace} />
    </View>

    <View style={styles.hero}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>📅</Text>
      </View>

      <View style={styles.todayBadge}>
        <Text style={styles.todayBadgeText}>
          TODAY'S CHALLENGE
        </Text>
      </View>

      <Text style={styles.title}>
        Test Yourself Today
      </Text>

      <Text style={styles.subtitle}>
        A fresh BrainRush challenge awaits you.
      </Text>
    </View>

    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardLabel}>
            DAILY QUIZ
          </Text>

          <Text style={styles.cardTitle}>
            Today's Challenge
          </Text>
        </View>

        <View style={styles.starCircle}>
          <Text style={styles.star}>⭐</Text>
        </View>
      </View>

      <Text style={styles.description}>
        Answer 5 questions as quickly and accurately
        as possible. Your daily performance is tracked
        separately from regular quizzes.
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.info}>
          <View style={styles.infoIconCircle}>
            <Text style={styles.infoIcon}>❓</Text>
          </View>

          <Text style={styles.infoValue}>5</Text>

          <Text style={styles.infoLabel}>
            Questions
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.info}>
          <View style={styles.infoIconCircle}>
            <Text style={styles.infoIcon}>⏱️</Text>
          </View>

          <Text style={styles.infoValue}>15s</Text>

          <Text style={styles.infoLabel}>
            Per Question
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.info}>
          <View style={styles.infoIconCircle}>
            <Text style={styles.infoIcon}>🏆</Text>
          </View>

          <Text style={styles.infoValue}>5</Text>

          <Text style={styles.infoLabel}>
            Max Points
          </Text>
        </View>
      </View>
    </View>

    <View style={styles.tipCard}>
      <View style={styles.tipIcon}>
        <Text>💡</Text>
      </View>

      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>
          Quick Tip
        </Text>

        <Text style={styles.tipText}>
          Read each question carefully. Speed matters,
          but accuracy matters too!
        </Text>
      </View>
    </View>

    {completed ? (
      <View style={styles.completedBox}>
        <View style={styles.completedIconCircle}>
          <Text style={styles.completedIcon}>✓</Text>
        </View>

        <Text style={styles.completedTitle}>
          Challenge Complete
        </Text>

        <Text style={styles.completedText}>
          You have already completed today's
          challenge. Come back tomorrow for a new
          challenge!
        </Text>

        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>
            COME BACK TOMORROW
          </Text>
        </View>
      </View>
    ) : (
      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.85}
        onPress={startChallenge}
      >
        <View style={styles.startIconCircle}>
          <Text style={styles.startIcon}>▶</Text>
        </View>

        <View style={styles.startContent}>
          <Text style={styles.startText}>
            START DAILY CHALLENGE
          </Text>

          <Text style={styles.startSubtext}>
            5 questions • 15 seconds each
          </Text>
        </View>

        <Text style={styles.startArrow}>›</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles.homeButton}
      activeOpacity={0.8}
      onPress={() => router.replace('/')}
    >
      <Text style={styles.homeText}>
        🏠  BACK TO HOME
      </Text>
    </TouchableOpacity>

    <Text style={styles.footer}>
      BrainRush • Think Fast. Answer Faster.
    </Text>
  </ScrollView>
</SafeAreaView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#0F172A',
},

content: {
paddingHorizontal: 18,
paddingBottom: 40,
},

header: {
height: 76,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
borderBottomWidth: 1,
borderBottomColor: '#1E293B',
},

backButton: {
width: 44,
height: 44,
borderRadius: 14,
backgroundColor: '#1E293B',
alignItems: 'center',
justifyContent: 'center',
},

backText: {
color: '#FFFFFF',
fontSize: 34,
lineHeight: 36,
fontWeight: '300',
marginTop: -3,
},

headerCenter: {
alignItems: 'center',
justifyContent: 'center',
},

headerTitle: {
color: '#FFFFFF',
fontSize: 14,
fontWeight: '900',
letterSpacing: 1.1,
},

headerSubtitle: {
color: '#60A5FA',
fontSize: 9,
fontWeight: '700',
letterSpacing: 1.5,
marginTop: 4,
},

headerSpace: {
width: 44,
height: 44,
},

hero: {
alignItems: 'center',
paddingTop: 25,
},

iconCircle: {
width: 90,
height: 90,
borderRadius: 45,
backgroundColor: '#172554',
borderWidth: 2,
borderColor: '#2563EB',
alignItems: 'center',
justifyContent: 'center',
shadowColor: '#2563EB',
shadowOpacity: 0.25,
shadowRadius: 14,
shadowOffset: {
width: 0,
height: 6,
},
elevation: 6,
},

icon: {
fontSize: 44,
},

todayBadge: {
marginTop: 15,
paddingHorizontal: 12,
paddingVertical: 6,
borderRadius: 20,
backgroundColor: '#172554',
borderWidth: 1,
borderColor: '#1D4ED8',
},

todayBadgeText: {
color: '#60A5FA',
fontSize: 9,
fontWeight: '900',
letterSpacing: 1.2,
},

title: {
color: '#FFFFFF',
fontSize: 26,
fontWeight: '900',
textAlign: 'center',
marginTop: 13,
},

subtitle: {
color: '#94A3B8',
fontSize: 13,
textAlign: 'center',
marginTop: 6,
marginBottom: 22,
},

card: {
width: '100%',
backgroundColor: '#1E293B',
borderRadius: 21,
padding: 18,
borderWidth: 1,
borderColor: '#334155',
},

cardHeader: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
},

cardLabel: {
color: '#60A5FA',
fontSize: 9,
fontWeight: '900',
letterSpacing: 1.2,
},

cardTitle: {
color: '#FFFFFF',
fontSize: 20,
fontWeight: '900',
marginTop: 3,
},

starCircle: {
width: 44,
height: 44,
borderRadius: 14,
backgroundColor: '#172554',
alignItems: 'center',
justifyContent: 'center',
},

star: {
fontSize: 21,
},

description: {
color: '#94A3B8',
fontSize: 13,
lineHeight: 20,
marginTop: 14,
},

infoRow: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 20,
},

info: {
flex: 1,
alignItems: 'center',
},

infoIconCircle: {
width: 36,
height: 36,
borderRadius: 11,
backgroundColor: '#172554',
alignItems: 'center',
justifyContent: 'center',
},

infoIcon: {
fontSize: 17,
},

infoValue: {
color: '#60A5FA',
fontSize: 18,
fontWeight: '900',
marginTop: 5,
},

infoLabel: {
color: '#64748B',
fontSize: 9,
fontWeight: '700',
marginTop: 2,
textAlign: 'center',
},

divider: {
width: 1,
height: 58,
backgroundColor: '#334155',
},

tipCard: {
width: '100%',
flexDirection: 'row',
backgroundColor: '#172554',
borderRadius: 17,
padding: 14,
marginTop: 13,
borderWidth: 1,
borderColor: '#1E3A8A',
},

tipIcon: {
width: 40,
height: 40,
borderRadius: 12,
backgroundColor: '#1E3A8A',
alignItems: 'center',
justifyContent: 'center',
marginRight: 11,
},

tipContent: {
flex: 1,
},

tipTitle: {
color: '#FFFFFF',
fontSize: 12,
fontWeight: '900',
},

tipText: {
color: '#BFDBFE',
fontSize: 11,
lineHeight: 17,
marginTop: 3,
},

startButton: {
width: '100%',
minHeight: 64,
backgroundColor: '#2563EB',
borderRadius: 17,
flexDirection: 'row',
alignItems: 'center',
paddingHorizontal: 13,
marginTop: 16,
},

startIconCircle: {
width: 40,
height: 40,
borderRadius: 20,
backgroundColor: '#FFFFFF',
alignItems: 'center',
justifyContent: 'center',
},

startIcon: {
color: '#2563EB',
fontSize: 15,
marginLeft: 2,
},

startContent: {
flex: 1,
marginLeft: 11,
},

startText: {
color: '#FFFFFF',
fontSize: 13,
fontWeight: '900',
letterSpacing: 0.3,
},

startSubtext: {
color: '#BFDBFE',
fontSize: 10,
marginTop: 3,
},

startArrow: {
color: '#FFFFFF',
fontSize: 29,
fontWeight: '300',
marginLeft: 8,
},

completedBox: {
width: '100%',
backgroundColor: '#1E293B',
borderRadius: 20,
padding: 22,
alignItems: 'center',
marginTop: 16,
borderWidth: 1,
borderColor: '#166534',
},

completedIconCircle: {
width: 62,
height: 62,
borderRadius: 31,
backgroundColor: '#14532D',
alignItems: 'center',
justifyContent: 'center',
},

completedIcon: {
color: '#4ADE80',
fontSize: 32,
fontWeight: '900',
},

completedTitle: {
color: '#FFFFFF',
fontSize: 18,
fontWeight: '900',
marginTop: 12,
},

completedText: {
color: '#94A3B8',
fontSize: 12,
lineHeight: 19,
textAlign: 'center',
marginTop: 7,
},

completedBadge: {
backgroundColor: '#14532D',
borderRadius: 20,
paddingHorizontal: 12,
paddingVertical: 6,
marginTop: 13,
},

completedBadgeText: {
color: '#86EFAC',
fontSize: 9,
fontWeight: '900',
letterSpacing: 0.8,
},

homeButton: {
width: '100%',
height: 54,
backgroundColor: '#1E293B',
borderRadius: 15,
alignItems: 'center',
justifyContent: 'center',
marginTop: 13,
borderWidth: 1,
borderColor: '#334155',
},

homeText: {
color: '#CBD5E1',
fontSize: 13,
fontWeight: '900',
letterSpacing: 0.5,
},

footer: {
color: '#475569',
fontSize: 10,
textAlign: 'center',
marginTop: 18,
},
});
