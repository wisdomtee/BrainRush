import React, { useEffect, useState } from 'react';
import {
SafeAreaView,
View,
Text,
StyleSheet,
TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
{
question: 'What is the largest ocean on Earth?',
options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'],
answer: 'Pacific',
},
{
question: 'What is 12 × 8?',
options: ['86', '96', '108', '112'],
answer: '96',
},
{
question: 'Who developed the theory of relativity?',
options: [
'Isaac Newton',
'Albert Einstein',
'Galileo Galilei',
'Nikola Tesla',
],
answer: 'Albert Einstein',
},
{
question: 'Which gas do humans need to breathe?',
options: [
'Carbon dioxide',
'Oxygen',
'Hydrogen',
'Nitrogen',
],
answer: 'Oxygen',
},
{
question: 'Which continent is Nigeria located in?',
options: [
'Asia',
'Europe',
'Africa',
'South America',
],
answer: 'Africa',
},
];

const TIME_PER_QUESTION = 15;

const getTodayKey = () => {
const date = new Date();

return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export default function DailyGameScreen() {
const router = useRouter();

const [currentQuestion, setCurrentQuestion] =
useState(0);

const [score, setScore] = useState(0);

const [timeLeft, setTimeLeft] =
useState(TIME_PER_QUESTION);

const [selected, setSelected] =
useState<string | null>(null);

const [showFeedback, setShowFeedback] =
useState(false);

const question = questions[currentQuestion];

const isCorrect =
selected !== null &&
selected === question.answer;

const unlockAchievement = async (
achievementId: string
) => {
try {
const saved =
await AsyncStorage.getItem(
'achievements'
);

  const achievements: string[] = saved
    ? JSON.parse(saved)
    : [];

  if (!achievements.includes(achievementId)) {
    achievements.push(achievementId);

    await AsyncStorage.setItem(
      'achievements',
      JSON.stringify(achievements)
    );
  }
} catch (error) {
  console.log(
    'Error unlocking achievement:',
    error
  );
}

};

const finishDailyChallenge = async (
finalScore: number
) => {
try {
const playerName =
(await AsyncStorage.getItem(
'playerName'
)) || 'You';

  await AsyncStorage.setItem(
    'dailyChallengeDate',
    getTodayKey()
  );

  await AsyncStorage.setItem(
    'dailyScore',
    finalScore.toString()
  );

  await unlockAchievement(
    'daily_champion'
  );

  const storedLeaderboard =
    await AsyncStorage.getItem(
      'leaderboard'
    );

  let leaderboard = storedLeaderboard
    ? JSON.parse(storedLeaderboard)
    : [];

  leaderboard.push({
    name: `${playerName} ⭐ Daily`,
    score: finalScore,
  });

  leaderboard.sort(
    (a: any, b: any) =>
      b.score - a.score
  );

  leaderboard =
    leaderboard.slice(0, 10);

  await AsyncStorage.setItem(
    'leaderboard',
    JSON.stringify(leaderboard)
  );

  router.replace({
    pathname: '/results',
    params: {
      score: finalScore.toString(),
      streak: '0',
      daily: 'true',
    },
  });
} catch (error) {
  console.log(
    'Failed to save daily challenge:',
    error
  );
}

};

const moveToNextQuestion = () => {
if (
currentQuestion <
questions.length - 1
) {
setCurrentQuestion(
(prev) => prev + 1
);

  setSelected(null);
  setShowFeedback(false);
  setTimeLeft(
    TIME_PER_QUESTION
  );
} else {
  finishDailyChallenge(score);
}

};

const handleAnswer = (
option: string
) => {
if (selected) return;

setSelected(option);
setShowFeedback(true);

if (option === question.answer) {
  const newScore = score + 1;

  setScore(newScore);

  setTimeout(() => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );

      setSelected(null);
      setShowFeedback(false);
      setTimeLeft(
        TIME_PER_QUESTION
      );
    } else {
      finishDailyChallenge(
        newScore
      );
    }
  }, 850);
} else {
  setTimeout(() => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );

      setSelected(null);
      setShowFeedback(false);
      setTimeLeft(
        TIME_PER_QUESTION
      );
    } else {
      finishDailyChallenge(score);
    }
  }, 850);
}

};

useEffect(() => {
if (selected) return;

if (timeLeft <= 0) {
  moveToNextQuestion();
  return;
}

const timer = setInterval(() => {
  setTimeLeft(
    (prev) => prev - 1
  );
}, 1000);

return () =>
  clearInterval(timer);

}, [
timeLeft,
selected,
]);

const progressPercentage =
((currentQuestion + 1) /
questions.length) *
100;

return ( <SafeAreaView style={styles.container}> <View style={styles.content}> <View style={styles.header}> <View style={styles.dailyBadge}> <Text style={styles.dailyIcon}>
📅 </Text>

        <View>
          <Text style={styles.dailyTitle}>
            DAILY CHALLENGE
          </Text>

          <Text style={styles.dailySubtitle}>
            TODAY'S QUIZ
          </Text>
        </View>
      </View>

      <View style={styles.scoreBadge}>
        <Text style={styles.scoreLabel}>
          SCORE
        </Text>

        <Text style={styles.scoreValue}>
          {score}
        </Text>
      </View>
    </View>

    <View style={styles.progressSection}>
      <View style={styles.progressLabels}>
        <Text style={styles.progressText}>
          QUESTION {currentQuestion + 1} OF{' '}
          {questions.length}
        </Text>

        <Text style={styles.progressPercent}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width:
                progressPercentage + '%',
            },
          ]}
        />
      </View>
    </View>

    <View
      style={[
        styles.timerContainer,
        timeLeft <= 5 &&
          styles.timerWarningContainer,
      ]}
    >
      <View style={styles.timerIconCircle}>
        <Text style={styles.timerIcon}>
          ⏱
        </Text>
      </View>

      <View>
        <Text style={styles.timerLabel}>
          TIME LEFT
        </Text>

        <Text
          style={[
            styles.timer,
            timeLeft <= 5 &&
              styles.timerWarning,
          ]}
        >
          {timeLeft}s
        </Text>
      </View>
    </View>

    <View style={styles.questionBox}>
      <View style={styles.questionTag}>
        <Text style={styles.questionTagText}>
          DAILY QUESTION
        </Text>
      </View>

      <Text style={styles.question}>
        {question.question}
      </Text>
    </View>

    <View style={styles.options}>
      {question.options.map(
        (option, index) => {
          const isSelected =
            selected === option;

          const optionIsCorrect =
            selected !== null &&
            option ===
              question.answer;

          const isWrong =
            isSelected &&
            option !==
              question.answer;

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                isSelected &&
                  styles.selectedOption,
                optionIsCorrect &&
                  styles.correctOption,
                isWrong &&
                  styles.wrongOption,
              ]}
              activeOpacity={0.85}
              disabled={
                selected !== null
              }
              onPress={() =>
                handleAnswer(
                  option
                )
              }
            >
              <View
                style={[
                  styles.optionNumber,
                  isSelected &&
                    styles.selectedNumber,
                  optionIsCorrect &&
                    styles.correctNumber,
                  isWrong &&
                    styles.wrongNumber,
                ]}
              >
                <Text
                  style={[
                    styles.optionNumberText,
                    isSelected &&
                      styles.activeOptionNumberText,
                  ]}
                >
                  {String.fromCharCode(
                    65 + index
                  )}
                </Text>
              </View>

              <Text
                style={[
                  styles.optionText,
                  isSelected &&
                    styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>

              {optionIsCorrect && (
                <Text
                  style={styles.answerIcon}
                >
                  ✓
                </Text>
              )}

              {isWrong && (
                <Text
                  style={styles.answerIcon}
                >
                  ✕
                </Text>
              )}
            </TouchableOpacity>
          );
        }
      )}
    </View>

    {showFeedback && (
      <View
        style={[
          styles.feedback,
          isCorrect
            ? styles.correctFeedback
            : styles.wrongFeedback,
        ]}
      >
        <Text style={styles.feedbackEmoji}>
          {isCorrect ? '🎉' : '💡'}
        </Text>

        <View style={styles.feedbackContent}>
          <Text style={styles.feedbackTitle}>
            {isCorrect
              ? 'Correct!'
              : 'Not quite!'}
          </Text>

          <Text style={styles.feedbackText}>
            {isCorrect
              ? 'Great answer. Keep going!'
              : `Correct answer: ${question.answer}`}
          </Text>
        </View>
      </View>
    )}

    <Text style={styles.footer}>
      BrainRush Daily • Think Fast. Answer Faster.
    </Text>
  </View>
</SafeAreaView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#0F172A',
},

content: {
flex: 1,
paddingHorizontal: 18,
paddingTop: 12,
},

header: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
marginBottom: 18,
},

dailyBadge: {
flexDirection: 'row',
alignItems: 'center',
},

dailyIcon: {
width: 42,
height: 42,
borderRadius: 13,
backgroundColor: '#172554',
textAlign: 'center',
textAlignVertical: 'center',
fontSize: 21,
marginRight: 10,
overflow: 'hidden',
},

dailyTitle: {
color: '#FFFFFF',
fontSize: 13,
fontWeight: '900',
letterSpacing: 0.8,
},

dailySubtitle: {
color: '#60A5FA',
fontSize: 9,
fontWeight: '700',
letterSpacing: 1.1,
marginTop: 2,
},

scoreBadge: {
backgroundColor: '#1E293B',
borderRadius: 13,
paddingHorizontal: 13,
paddingVertical: 8,
minWidth: 62,
alignItems: 'center',
borderWidth: 1,
borderColor: '#334155',
},

scoreLabel: {
color: '#64748B',
fontSize: 8,
fontWeight: '900',
letterSpacing: 0.8,
},

scoreValue: {
color: '#FBBF24',
fontSize: 19,
fontWeight: '900',
marginTop: 1,
},

progressSection: {
marginBottom: 17,
},

progressLabels: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 7,
},

progressText: {
color: '#64748B',
fontSize: 9,
fontWeight: '900',
letterSpacing: 0.8,
},

progressPercent: {
color: '#60A5FA',
fontSize: 10,
fontWeight: '900',
},

progressBackground: {
width: '100%',
height: 6,
borderRadius: 3,
backgroundColor: '#1E293B',
overflow: 'hidden',
},

progressFill: {
height: '100%',
borderRadius: 3,
backgroundColor: '#2563EB',
},

timerContainer: {
alignSelf: 'center',
minWidth: 104,
height: 62,
borderRadius: 18,
backgroundColor: '#172554',
borderWidth: 1,
borderColor: '#1D4ED8',
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
paddingHorizontal: 14,
marginBottom: 15,
},

timerWarningContainer: {
backgroundColor: '#450A0A',
borderColor: '#991B1B',
},

timerIconCircle: {
width: 34,
height: 34,
borderRadius: 11,
backgroundColor: '#1E3A8A',
alignItems: 'center',
justifyContent: 'center',
marginRight: 9,
},

timerIcon: {
fontSize: 17,
},

timerLabel: {
color: '#93C5FD',
fontSize: 8,
fontWeight: '900',
letterSpacing: 0.8,
},

timer: {
color: '#FFFFFF',
fontSize: 21,
fontWeight: '900',
marginTop: 1,
},

timerWarning: {
color: '#F87171',
},

questionBox: {
backgroundColor: '#1E293B',
borderRadius: 20,
padding: 21,
minHeight: 155,
justifyContent: 'center',
alignItems: 'center',
borderWidth: 1,
borderColor: '#334155',
marginBottom: 15,
},

questionTag: {
backgroundColor: '#172554',
borderRadius: 20,
paddingHorizontal: 10,
paddingVertical: 5,
marginBottom: 11,
},

questionTagText: {
color: '#60A5FA',
fontSize: 8,
fontWeight: '900',
letterSpacing: 1,
},

question: {
color: '#FFFFFF',
fontSize: 20,
fontWeight: '800',
textAlign: 'center',
lineHeight: 29,
},

options: {
gap: 9,
},

option: {
minHeight: 54,
backgroundColor: '#1E293B',
borderRadius: 15,
flexDirection: 'row',
alignItems: 'center',
paddingHorizontal: 11,
borderWidth: 1,
borderColor: '#334155',
},

selectedOption: {
borderColor: '#2563EB',
backgroundColor: '#172554',
},

correctOption: {
backgroundColor: '#14532D',
borderColor: '#22C55E',
},

wrongOption: {
backgroundColor: '#450A0A',
borderColor: '#EF4444',
},

optionNumber: {
width: 34,
height: 34,
borderRadius: 11,
backgroundColor: '#0F172A',
alignItems: 'center',
justifyContent: 'center',
marginRight: 11,
},

selectedNumber: {
backgroundColor: '#1E3A8A',
},

correctNumber: {
backgroundColor: '#166534',
},

wrongNumber: {
backgroundColor: '#7F1D1D',
},

optionNumberText: {
color: '#94A3B8',
fontSize: 12,
fontWeight: '900',
},

activeOptionNumberText: {
color: '#FFFFFF',
},

optionText: {
flex: 1,
color: '#E2E8F0',
fontSize: 14,
fontWeight: '700',
},

selectedOptionText: {
color: '#FFFFFF',
},

answerIcon: {
color: '#FFFFFF',
fontSize: 20,
fontWeight: '900',
marginLeft: 8,
},

feedback: {
flexDirection: 'row',
alignItems: 'center',
borderRadius: 15,
padding: 12,
marginTop: 11,
borderWidth: 1,
},

correctFeedback: {
backgroundColor: '#14532D',
borderColor: '#166534',
},

wrongFeedback: {
backgroundColor: '#172554',
borderColor: '#1E3A8A',
},

feedbackEmoji: {
fontSize: 22,
marginRight: 10,
},

feedbackContent: {
flex: 1,
},

feedbackTitle: {
color: '#FFFFFF',
fontSize: 13,
fontWeight: '900',
},

feedbackText: {
color: '#CBD5E1',
fontSize: 11,
lineHeight: 16,
marginTop: 2,
},

footer: {
color: '#475569',
fontSize: 9,
textAlign: 'center',
marginTop: 'auto',
marginBottom: 10,
},
});
