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

type ReviewItem = {
question: string;
selectedAnswer: string;
correctAnswer: string;
explanation: string;
};

export default function ReviewScreen() {
const [answers, setAnswers] = useState<ReviewItem[]>([]);

const loadReview = useCallback(async () => {
try {
const saved =
await AsyncStorage.getItem('lastQuizReview');

  if (saved) {
    setAnswers(JSON.parse(saved));
  } else {
    setAnswers([]);
  }
} catch (error) {
  console.log('Error loading review:', error);
}

}, []);

useFocusEffect(
useCallback(() => {
loadReview();
}, [loadReview])
);

const correctCount = answers.filter(
(item) =>
item.selectedAnswer === item.correctAnswer
).length;

const percentage =
answers.length > 0
? Math.round(
(correctCount / answers.length) * 100
)
: 0;

return ( <View style={styles.container}> <View style={styles.header}>
<TouchableOpacity
style={styles.backButton}
activeOpacity={0.8}
onPress={() => router.back()}
> <Text style={styles.back}>‹</Text> </TouchableOpacity>

```
    <View style={styles.headerCenter}>
      <Text style={styles.headerTitle}>
        QUESTION REVIEW
      </Text>

      <Text style={styles.headerSubtitle}>
        LEARN FROM YOUR ANSWERS
      </Text>
    </View>

    <View style={styles.headerSpace} />
  </View>

  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.content}
  >
    {answers.length > 0 && (
      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Text style={styles.summaryEmoji}>
            📋
          </Text>
        </View>

        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>
            QUIZ SUMMARY
          </Text>

          <Text style={styles.summaryTitle}>
            {correctCount}/{answers.length} Correct
          </Text>

          <Text style={styles.summarySubtitle}>
            {percentage}% accuracy
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>
            {percentage}%
          </Text>
        </View>
      </View>
    )}

    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>
          YOUR ANSWERS
        </Text>

        {answers.length > 0 && (
          <Text style={styles.sectionSubtitle}>
            Review each question and explanation
          </Text>
        )}
      </View>

      {answers.length > 0 && (
        <View style={styles.questionCount}>
          <Text style={styles.questionCountText}>
            {answers.length}
          </Text>
        </View>
      )}
    </View>

    {answers.length === 0 ? (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconCircle}>
          <Text style={styles.emptyIcon}>🧠</Text>
        </View>

        <Text style={styles.emptyTitle}>
          Nothing to review yet
        </Text>

        <Text style={styles.emptyText}>
          Complete a quiz first and your answers
          will appear here.
        </Text>

        <TouchableOpacity
          style={styles.playButton}
          activeOpacity={0.85}
          onPress={() =>
            router.replace('/categories')
          }
        >
          <Text style={styles.playText}>
            ▶  PLAY A QUIZ
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      answers.map((item, index) => {
        const correct =
          item.selectedAnswer ===
          item.correctAnswer;

        return (
          <View
            key={`${item.question}-${index}`}
            style={[
              styles.card,
              correct
                ? styles.correctCard
                : styles.incorrectCard,
            ]}
          >
            <View style={styles.cardTopRow}>
              <View
                style={[
                  styles.questionNumber,
                  correct
                    ? styles.correctNumber
                    : styles.incorrectNumber,
                ]}
              >
                <Text
                  style={styles.questionNumberText}
                >
                  {index + 1}
                </Text>
              </View>

              <View style={styles.cardTopContent}>
                <Text style={styles.questionLabel}>
                  QUESTION {index + 1}
                </Text>

                <View
                  style={[
                    styles.resultPill,
                    correct
                      ? styles.correctPill
                      : styles.incorrectPill,
                  ]}
                >
                  <Text
                    style={[
                      styles.resultText,
                      correct
                        ? styles.correctResult
                        : styles.incorrectResult,
                    ]}
                  >
                    {correct
                      ? '✓ CORRECT'
                      : '✕ INCORRECT'}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.question}>
              {item.question}
            </Text>

            <View style={styles.answerBox}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  YOUR ANSWER
                </Text>

                <Text style={styles.answerIcon}>
                  {correct ? '✓' : '•'}
                </Text>
              </View>

              <Text style={styles.answer}>
                {item.selectedAnswer}
              </Text>
            </View>

            {!correct && (
              <View style={styles.correctBox}>
                <View style={styles.labelRow}>
                  <Text style={styles.correctLabel}>
                    CORRECT ANSWER
                  </Text>

                  <Text style={styles.correctIcon}>
                    ✓
                  </Text>
                </View>

                <Text style={styles.correctAnswer}>
                  {item.correctAnswer}
                </Text>
              </View>
            )}

            <View style={styles.explanationBox}>
              <View style={styles.explanationHeader}>
                <View style={styles.lightbulb}>
                  <Text>💡</Text>
                </View>

                <Text style={styles.explanationTitle}>
                  EXPLANATION
                </Text>
              </View>

              <Text style={styles.explanation}>
                {item.explanation}
              </Text>
            </View>
          </View>
        );
      })
    )}

    {answers.length > 0 && (
      <View style={styles.learningCard}>
        <View style={styles.learningIcon}>
          <Text style={styles.learningEmoji}>
            🧠
          </Text>
        </View>

        <View style={styles.learningContent}>
          <Text style={styles.learningTitle}>
            Keep learning
          </Text>

          <Text style={styles.learningText}>
            Reviewing your answers helps you learn
            from mistakes and improve your next score.
          </Text>
        </View>
      </View>
    )}

    <TouchableOpacity
      style={styles.homeButton}
      activeOpacity={0.85}
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
</View>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#0F172A',
},

header: {
height: 76,
paddingHorizontal: 18,
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

back: {
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
letterSpacing: 1.7,
marginTop: 4,
},

headerSpace: {
width: 44,
height: 44,
},

content: {
padding: 18,
paddingBottom: 40,
},

summaryCard: {
backgroundColor: '#172554',
borderRadius: 20,
padding: 16,
flexDirection: 'row',
alignItems: 'center',
borderWidth: 1,
borderColor: '#1D4ED8',
marginBottom: 22,
},

summaryIcon: {
width: 52,
height: 52,
borderRadius: 16,
backgroundColor: '#1E3A8A',
alignItems: 'center',
justifyContent: 'center',
marginRight: 13,
},

summaryEmoji: {
fontSize: 25,
},

summaryContent: {
flex: 1,
},

summaryLabel: {
color: '#93C5FD',
fontSize: 9,
fontWeight: '900',
letterSpacing: 1.2,
},

summaryTitle: {
color: '#FFFFFF',
fontSize: 18,
fontWeight: '900',
marginTop: 3,
},

summarySubtitle: {
color: '#BFDBFE',
fontSize: 11,
marginTop: 2,
},

scoreBadge: {
minWidth: 54,
height: 54,
borderRadius: 27,
backgroundColor: '#2563EB',
alignItems: 'center',
justifyContent: 'center',
},

scoreBadgeText: {
color: '#FFFFFF',
fontSize: 14,
fontWeight: '900',
},

sectionHeader: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
marginBottom: 12,
},

sectionTitle: {
color: '#FFFFFF',
fontSize: 13,
fontWeight: '900',
letterSpacing: 1,
},

sectionSubtitle: {
color: '#64748B',
fontSize: 10,
marginTop: 4,
},

questionCount: {
minWidth: 32,
height: 30,
borderRadius: 15,
backgroundColor: '#1E293B',
alignItems: 'center',
justifyContent: 'center',
paddingHorizontal: 9,
},

questionCountText: {
color: '#60A5FA',
fontSize: 12,
fontWeight: '900',
},

card: {
backgroundColor: '#1E293B',
borderRadius: 20,
padding: 17,
marginBottom: 15,
borderWidth: 1,
},

correctCard: {
borderColor: '#166534',
},

incorrectCard: {
borderColor: '#7F1D1D',
},

cardTopRow: {
flexDirection: 'row',
alignItems: 'center',
},

questionNumber: {
width: 40,
height: 40,
borderRadius: 13,
alignItems: 'center',
justifyContent: 'center',
marginRight: 11,
},

correctNumber: {
backgroundColor: '#14532D',
},

incorrectNumber: {
backgroundColor: '#450A0A',
},

questionNumberText: {
color: '#FFFFFF',
fontSize: 16,
fontWeight: '900',
},

cardTopContent: {
flex: 1,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
},

questionLabel: {
color: '#64748B',
fontSize: 10,
fontWeight: '900',
letterSpacing: 0.9,
},

resultPill: {
paddingHorizontal: 9,
paddingVertical: 5,
borderRadius: 10,
},

correctPill: {
backgroundColor: '#14532D',
},

incorrectPill: {
backgroundColor: '#450A0A',
},

resultText: {
fontSize: 9,
fontWeight: '900',
letterSpacing: 0.5,
},

correctResult: {
color: '#4ADE80',
},

incorrectResult: {
color: '#F87171',
},

question: {
color: '#FFFFFF',
fontSize: 17,
lineHeight: 24,
fontWeight: '800',
marginTop: 15,
},

answerBox: {
backgroundColor: '#0F172A',
borderRadius: 13,
padding: 13,
marginTop: 14,
borderWidth: 1,
borderColor: '#334155',
},

labelRow: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
},

label: {
color: '#64748B',
fontSize: 9,
fontWeight: '900',
letterSpacing: 1,
},

answerIcon: {
color: '#60A5FA',
fontSize: 16,
fontWeight: '900',
},

answer: {
color: '#FFFFFF',
fontSize: 14,
fontWeight: '600',
marginTop: 7,
lineHeight: 20,
},

correctBox: {
backgroundColor: '#14532D',
borderRadius: 13,
padding: 13,
marginTop: 10,
borderWidth: 1,
borderColor: '#166534',
},

correctLabel: {
color: '#86EFAC',
fontSize: 9,
fontWeight: '900',
letterSpacing: 1,
},

correctIcon: {
color: '#4ADE80',
fontSize: 16,
fontWeight: '900',
},

correctAnswer: {
color: '#FFFFFF',
fontSize: 14,
fontWeight: '800',
marginTop: 7,
lineHeight: 20,
},

explanationBox: {
backgroundColor: '#172554',
borderRadius: 13,
padding: 13,
marginTop: 10,
borderWidth: 1,
borderColor: '#1E3A8A',
},

explanationHeader: {
flexDirection: 'row',
alignItems: 'center',
},

lightbulb: {
width: 27,
height: 27,
borderRadius: 9,
backgroundColor: '#1E3A8A',
alignItems: 'center',
justifyContent: 'center',
marginRight: 8,
},

explanationTitle: {
color: '#93C5FD',
fontSize: 9,
fontWeight: '900',
letterSpacing: 1,
},

explanation: {
color: '#DBEAFE',
fontSize: 13,
lineHeight: 20,
marginTop: 9,
},

emptyCard: {
backgroundColor: '#1E293B',
borderRadius: 20,
padding: 28,
alignItems: 'center',
borderWidth: 1,
borderColor: '#334155',
marginTop: 8,
},

emptyIconCircle: {
width: 76,
height: 76,
borderRadius: 38,
backgroundColor: '#172554',
alignItems: 'center',
justifyContent: 'center',
marginBottom: 15,
},

emptyIcon: {
fontSize: 34,
},

emptyTitle: {
color: '#FFFFFF',
fontSize: 19,
fontWeight: '900',
},

emptyText: {
color: '#94A3B8',
fontSize: 13,
textAlign: 'center',
lineHeight: 20,
marginTop: 8,
maxWidth: 280,
},

playButton: {
backgroundColor: '#2563EB',
borderRadius: 14,
paddingVertical: 14,
paddingHorizontal: 25,
marginTop: 18,
},

playText: {
color: '#FFFFFF',
fontSize: 13,
fontWeight: '900',
letterSpacing: 0.5,
},

learningCard: {
flexDirection: 'row',
backgroundColor: '#1E293B',
borderRadius: 17,
padding: 14,
marginTop: 3,
borderWidth: 1,
borderColor: '#334155',
},

learningIcon: {
width: 42,
height: 42,
borderRadius: 13,
backgroundColor: '#172554',
alignItems: 'center',
justifyContent: 'center',
marginRight: 11,
},

learningEmoji: {
fontSize: 21,
},

learningContent: {
flex: 1,
},

learningTitle: {
color: '#FFFFFF',
fontSize: 13,
fontWeight: '800',
},

learningText: {
color: '#94A3B8',
fontSize: 11,
lineHeight: 17,
marginTop: 3,
},

homeButton: {
backgroundColor: '#2563EB',
borderRadius: 15,
height: 55,
alignItems: 'center',
justifyContent: 'center',
marginTop: 16,
},

homeText: {
color: '#FFFFFF',
fontSize: 14,
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
