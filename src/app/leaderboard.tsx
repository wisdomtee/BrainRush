import React, { useCallback, useState } from 'react';
import {
SafeAreaView,
View,
Text,
StyleSheet,
TouchableOpacity,
StatusBar,
ScrollView,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Player = {
name: string;
score: number;
};

export default function LeaderboardScreen() {
const router = useRouter();

const [players, setPlayers] = useState<Player[]>([]);

const loadLeaderboard = async () => {
try {
const stored =
await AsyncStorage.getItem('leaderboard');

  if (stored) {
    setPlayers(JSON.parse(stored));
  } else {
    const defaultPlayers: Player[] = [
      {
        name: 'Brain Master',
        score: 0,
      },
      {
        name: 'Quiz Champion',
        score: 0,
      },
      {
        name: 'Smart Player',
        score: 0,
      },
    ];

    setPlayers(defaultPlayers);
  }
} catch (error) {
  console.log(
    'Failed to load leaderboard:',
    error
  );
}

};

useFocusEffect(
useCallback(() => {
loadLeaderboard();
}, [])
);

const getMedal = (index: number) => {
if (index === 0) return '🥇';
if (index === 1) return '🥈';
if (index === 2) return '🥉';

return `${index + 1}`;

};

const getRankStyle = (index: number) => {
if (index === 0) {
return styles.goldRank;
}

if (index === 1) {
  return styles.silverRank;
}

if (index === 2) {
  return styles.bronzeRank;
}

return styles.normalRank;

};

return ( <SafeAreaView style={styles.container}> <StatusBar
     barStyle="light-content"
     backgroundColor="#0F172A"
   />

  {/* HEADER */}
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.backButton}
      activeOpacity={0.8}
      onPress={() => router.back()}
    >
      <Text style={styles.backText}>
        ‹
      </Text>
    </TouchableOpacity>

    <View style={styles.headerCenter}>
      <Text style={styles.headerTitle}>
        LEADERBOARD
      </Text>

      <Text style={styles.headerSubtitle}>
        BRAIN RUSH RANKINGS
      </Text>
    </View>

    <View style={styles.headerSpace} />
  </View>

  <ScrollView
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    {/* HERO */}
    <View style={styles.hero}>
      <View style={styles.trophyCircle}>
        <Text style={styles.trophy}>
          🏆
        </Text>
      </View>

      <Text style={styles.title}>
        Top Players
      </Text>

      <Text style={styles.subtitle}>
        Compete, improve, and climb the rankings.
      </Text>
    </View>

    {/* TOP 3 */}
    {players.length > 0 && (
      <View style={styles.podiumCard}>
        <Text style={styles.podiumTitle}>
          🏅 TOP PERFORMERS
        </Text>

        <View style={styles.podiumRow}>
          {players
            .slice(0, 3)
            .map((player, index) => (
              <View
                key={`podium-${player.name}-${index}`}
                style={[
                  styles.podiumPlayer,
                  index === 0 &&
                    styles.podiumWinner,
                ]}
              >
                <Text style={styles.podiumMedal}>
                  {getMedal(index)}
                </Text>

                <View
                  style={[
                    styles.podiumAvatar,
                    index === 0 &&
                      styles.podiumAvatarWinner,
                  ]}
                >
                  <Text
                    style={
                      styles.podiumAvatarText
                    }
                  >
                    {player.name
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>

                <Text
                  style={styles.podiumName}
                  numberOfLines={1}
                >
                  {player.name}
                </Text>

                <Text style={styles.podiumScore}>
                  {player.score}
                </Text>

                <Text style={styles.podiumPoints}>
                  points
                </Text>
              </View>
            ))}
        </View>
      </View>
    )}

    {/* FULL LEADERBOARD */}
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        ALL PLAYERS
      </Text>

      <Text style={styles.playerCount}>
        {players.length} players
      </Text>
    </View>

    <View style={styles.leaderboardCard}>
      {players.map((player, index) => (
        <View
          key={`${player.name}-${index}`}
          style={[
            styles.playerRow,
            index === 0 &&
              styles.firstPlayer,
          ]}
        >
          <View
            style={[
              styles.rank,
              getRankStyle(index),
            ]}
          >
            <Text
              style={[
                styles.rankText,
                index > 2 &&
                  styles.normalRankText,
              ]}
            >
              {getMedal(index)}
            </Text>
          </View>

          <View style={styles.playerInfo}>
            <Text
              style={styles.playerName}
              numberOfLines={1}
            >
              {player.name}
            </Text>

            <Text style={styles.playerLabel}>
              BrainRush Player
            </Text>
          </View>

          <View style={styles.scoreBox}>
            <Text style={styles.score}>
              {player.score}
            </Text>

            <Text style={styles.points}>
              points
            </Text>
          </View>
        </View>
      ))}

      {players.length === 0 && (
        <View style={styles.empty}>
          <View style={styles.emptyIconCircle}>
            <Text style={styles.emptyIcon}>
              🧠
            </Text>
          </View>

          <Text style={styles.emptyTitle}>
            No scores yet
          </Text>

          <Text style={styles.emptyText}>
            Play a game to appear on the
            leaderboard.
          </Text>
        </View>
      )}
    </View>

    {/* PLAY NOW */}
    <TouchableOpacity
      style={styles.playButton}
      activeOpacity={0.85}
      onPress={() =>
        router.push('/categories')
      }
    >
      <View style={styles.playIconCircle}>
        <Text style={styles.playIcon}>
          ▶
        </Text>
      </View>

      <View style={styles.playContent}>
        <Text style={styles.playText}>
          PLAY NOW
        </Text>

        <Text style={styles.playSubtext}>
          Challenge yourself and climb higher
        </Text>
      </View>

      <Text style={styles.playArrow}>
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

header: {
height: 70,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
paddingHorizontal: 20,
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

backText: {
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

trophyCircle: {
width: 88,
height: 88,
borderRadius: 44,
backgroundColor: '#1E293B',
borderWidth: 2,
borderColor: '#FBBF24',
alignItems: 'center',
justifyContent: 'center',
},

trophy: {
fontSize: 44,
},

title: {
color: '#FFFFFF',
fontSize: 28,
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

podiumCard: {
width: '100%',
backgroundColor: '#1E293B',
borderRadius: 22,
borderWidth: 1,
borderColor: '#334155',
padding: 16,
marginTop: 22,
},

podiumTitle: {
color: '#64748B',
fontSize: 11,
fontWeight: '900',
letterSpacing: 1.2,
marginBottom: 14,
},

podiumRow: {
flexDirection: 'row',
justifyContent: 'space-between',
},

podiumPlayer: {
width: '31%',
alignItems: 'center',
backgroundColor: '#172554',
borderRadius: 17,
paddingVertical: 12,
paddingHorizontal: 5,
borderWidth: 1,
borderColor: '#263B67',
},

podiumWinner: {
backgroundColor: '#172554',
borderColor: '#FBBF24',
},

podiumMedal: {
fontSize: 24,
marginBottom: 5,
},

podiumAvatar: {
width: 42,
height: 42,
borderRadius: 21,
backgroundColor: '#334155',
alignItems: 'center',
justifyContent: 'center',
},

podiumAvatarWinner: {
backgroundColor: '#FBBF24',
},

podiumAvatarText: {
color: '#FFFFFF',
fontSize: 17,
fontWeight: '900',
},

podiumName: {
color: '#FFFFFF',
fontSize: 11,
fontWeight: '800',
marginTop: 7,
textAlign: 'center',
},

podiumScore: {
color: '#FBBF24',
fontSize: 19,
fontWeight: '900',
marginTop: 5,
},

podiumPoints: {
color: '#64748B',
fontSize: 9,
marginTop: 1,
},

sectionHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginTop: 22,
marginBottom: 10,
},

sectionTitle: {
color: '#64748B',
fontSize: 11,
fontWeight: '900',
letterSpacing: 1.3,
},

playerCount: {
color: '#475569',
fontSize: 11,
fontWeight: '700',
},

leaderboardCard: {
width: '100%',
backgroundColor: '#1E293B',
borderRadius: 20,
padding: 10,
borderWidth: 1,
borderColor: '#334155',
},

playerRow: {
minHeight: 76,
flexDirection: 'row',
alignItems: 'center',
paddingHorizontal: 8,
borderRadius: 15,
marginBottom: 7,
},

firstPlayer: {
backgroundColor: '#172554',
borderWidth: 1,
borderColor: '#FBBF24',
},

rank: {
width: 43,
height: 43,
borderRadius: 14,
alignItems: 'center',
justifyContent: 'center',
backgroundColor: '#172554',
},

goldRank: {
backgroundColor: '#422006',
},

silverRank: {
backgroundColor: '#334155',
},

bronzeRank: {
backgroundColor: '#451A03',
},

normalRank: {
backgroundColor: '#172554',
},

rankText: {
fontSize: 20,
fontWeight: '900',
},

normalRankText: {
color: '#94A3B8',
fontSize: 15,
},

playerInfo: {
flex: 1,
marginLeft: 11,
marginRight: 8,
},

playerName: {
color: '#FFFFFF',
fontSize: 15,
fontWeight: '800',
},

playerLabel: {
color: '#64748B',
fontSize: 10,
marginTop: 3,
},

scoreBox: {
minWidth: 55,
alignItems: 'flex-end',
},

score: {
color: '#FBBF24',
fontSize: 18,
fontWeight: '900',
},

points: {
color: '#64748B',
fontSize: 9,
marginTop: 2,
},

empty: {
alignItems: 'center',
paddingVertical: 40,
paddingHorizontal: 20,
},

emptyIconCircle: {
width: 65,
height: 65,
borderRadius: 33,
backgroundColor: '#172554',
alignItems: 'center',
justifyContent: 'center',
},

emptyIcon: {
fontSize: 34,
},

emptyTitle: {
color: '#FFFFFF',
fontSize: 18,
fontWeight: '800',
marginTop: 12,
},

emptyText: {
color: '#64748B',
fontSize: 13,
marginTop: 5,
textAlign: 'center',
lineHeight: 19,
},

playButton: {
width: '100%',
minHeight: 72,
backgroundColor: '#2563EB',
borderRadius: 18,
paddingHorizontal: 15,
flexDirection: 'row',
alignItems: 'center',
marginTop: 20,
},

playIconCircle: {
width: 44,
height: 44,
borderRadius: 22,
backgroundColor: 'rgba(255,255,255,0.15)',
alignItems: 'center',
justifyContent: 'center',
},

playIcon: {
color: '#FFFFFF',
fontSize: 18,
},

playContent: {
flex: 1,
marginLeft: 13,
},

playText: {
color: '#FFFFFF',
fontSize: 15,
fontWeight: '900',
},

playSubtext: {
color: '#BFDBFE',
fontSize: 12,
marginTop: 3,
},

playArrow: {
color: '#FFFFFF',
fontSize: 30,
fontWeight: '300',
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
marginTop: 10,
},

homeText: {
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
});
