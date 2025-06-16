import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Award, Target, CircleCheck as CheckCircle, Circle as XCircle, RotateCcw, ChevronRight, Play, Trophy, Zap, Filter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { lawsAPI, quizAPI, progressAPI } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface Law {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  tags: string[];
}

export default function LearnScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [laws, setLaws] = useState<Law[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    try {
      setLoading(true);
      
      // Load quiz questions and laws
      const [quizData, lawsData] = await Promise.all([
        quizAPI.getQuestions(),
        lawsAPI.getAll()
      ]);
      
      setQuestions(quizData || []);
      setLaws(lawsData || []);
      
    } catch (error) {
      console.error('Error loading learning data:', error);
      // Data will be loaded from fallback in the API functions
    } finally {
      setLoading(false);
    }
  };

  const learningPaths = [
    {
      title: 'Constitutional Law',
      progress: 75,
      icon: <BookOpen size={18} color="#FFFFFF" />,
      topics: laws.filter(law => law.category === 'Constitutional Rights').length || 12,
      completed: Math.floor((laws.filter(law => law.category === 'Constitutional Rights').length || 12) * 0.75),
      gradient: ['#3B82F6', '#1E40AF'],
      duration: '4 weeks'
    },
    {
      title: 'Criminal Law',
      progress: 60,
      icon: <Award size={18} color="#FFFFFF" />,
      topics: laws.filter(law => law.category === 'Criminal Law').length || 15,
      completed: Math.floor((laws.filter(law => law.category === 'Criminal Law').length || 15) * 0.6),
      gradient: ['#8B5CF6', '#7C3AED'],
      duration: '6 weeks'
    },
    {
      title: 'Traffic Regulations',
      progress: 90,
      icon: <Target size={18} color="#FFFFFF" />,
      topics: laws.filter(law => law.category === 'Traffic Laws').length || 10,
      completed: Math.floor((laws.filter(law => law.category === 'Traffic Laws').length || 10) * 0.9),
      gradient: ['#10B981', '#059669'],
      duration: '2 weeks'
    }
  ];

  const categories = ['all', 'Constitutional Rights', 'Criminal Law', 'Traffic Laws', 'Consumer Rights', 'Cyber Law', 'Women Rights'];

  const filteredLaws = selectedCategory === 'all' 
    ? laws 
    : laws.filter(law => law.category === selectedCategory);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || questions.length === 0) return;

    setShowResult(true);
    const isCorrect = selectedAnswer === questions[currentQuestion].correct_answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);

    // Update progress animation
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Update user progress
    try {
      await progressAPI.updateProgress('demo-user', {
        quiz_score: Math.round(((score + (isCorrect ? 1 : 0)) / (answeredQuestions.length + 1)) * 100),
        last_activity: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizStarted(false);
    progressAnim.setValue(0);
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      Alert.alert('Loading Quiz', 'Quiz questions are being loaded. Please try again in a moment.');
      return;
    }
    setQuizStarted(true);
    Alert.alert(
      "Quiz Started! 🎯",
      "Test your legal knowledge with these questions. Good luck!",
      [{ text: "Let's Go!", style: "default" }]
    );
  };

  const handlePathPress = async (pathTitle: string) => {
    try {
      const categoryMap: { [key: string]: string } = {
        'Constitutional Law': 'Constitutional Rights',
        'Criminal Law': 'Criminal Law',
        'Traffic Regulations': 'Traffic Laws'
      };
      
      const category = categoryMap[pathTitle];
      
      if (category) {
        setSelectedCategory(category);
        Alert.alert(
          `${pathTitle} 📚`,
          `Starting your learning journey in ${pathTitle}. Explore laws and regulations in this category.`,
          [
            { text: "Start Learning", style: "default" }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Learning Path', `Starting ${pathTitle} learning path.`);
    }
  };

  const handleLawPress = (law: Law) => {
    Alert.alert(
      law.title,
      `${law.description}\n\nCategory: ${law.category}\nSeverity: ${law.severity}\nTags: ${law.tags.join(', ')}\n\nThis law is important for understanding your rights and responsibilities.`,
      [
        { text: 'Learn More', style: 'default', onPress: () => setSelectedCategory(law.category) },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const isQuizComplete = currentQuestion === questions.length - 1 && showResult;
  const currentQ = questions[currentQuestion];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return { message: 'Excellent! Legal Expert! 🏆', color: '#10B981' };
    if (percentage >= 60) return { message: 'Good job! Keep learning! 👍', color: '#F59E0B' };
    return { message: 'Keep studying! You can do better! 📚', color: '#EF4444' };
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>Learn & Practice</Text>
            <Text style={styles.subtitle}>Master legal concepts with interactive learning</Text>
          </Animated.View>

          {/* Learning Paths */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.sectionTitle}>Learning Paths</Text>
            <View style={styles.pathsContainer}>
              {learningPaths.map((path, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.pathCard}
                  onPress={() => handlePathPress(path.title)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#1F2937', '#111827']}
                    style={styles.pathCardGradient}
                  >
                    <View style={styles.pathHeader}>
                      <LinearGradient
                        colors={path.gradient}
                        style={styles.pathIcon}
                      >
                        {path.icon}
                      </LinearGradient>
                      <View style={styles.pathInfo}>
                        <Text style={styles.pathTitle}>{path.title}</Text>
                        <Text style={styles.pathDuration}>{path.duration} • {path.completed}/{path.topics} topics</Text>
                      </View>
                      <ChevronRight size={18} color="#6B7280" />
                    </View>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <LinearGradient
                          colors={path.gradient}
                          style={[styles.progressFill, { width: `${path.progress}%` }]}
                        />
                      </View>
                      <Text style={styles.progressText}>{path.progress}%</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Quick Quiz */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Legal Knowledge Quiz</Text>
              {!quizStarted && (
                <TouchableOpacity style={styles.playButton} onPress={startQuiz} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#40E0FF', '#1E40AF']}
                    style={styles.playButtonGradient}
                  >
                    <Play size={14} color="#FFFFFF" />
                    <Text style={styles.playText}>Start</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.quizCard}>
              <LinearGradient
                colors={['#1F2937', '#111827']}
                style={styles.quizCardGradient}
              >
                {quizStarted && questions.length > 0 ? (
                  <>
                    {/* Quiz Progress */}
                    <View style={styles.quizHeader}>
                      <Text style={styles.questionNumber}>
                        Question {currentQuestion + 1} of {questions.length}
                      </Text>
                      <View style={styles.scoreContainer}>
                        <Trophy size={14} color="#F59E0B" />
                        <Text style={styles.scoreText}>Score: {score}/{answeredQuestions.length}</Text>
                      </View>
                    </View>

                    <View style={styles.progressBarContainer}>
                      <Animated.View 
                        style={[
                          styles.quizProgressFill,
                          { width: progressAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                            extrapolate: 'clamp',
                          }) }
                        ]}
                      />
                    </View>
                    
                    {currentQ && (
                      <View style={styles.questionContainer}>
                        <View style={styles.questionHeader}>
                          <Text style={styles.question}>{currentQ.question}</Text>
                          <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(currentQ.difficulty)}20` }]}>
                            <Text style={[styles.difficultyText, { color: getDifficultyColor(currentQ.difficulty) }]}>
                              {currentQ.difficulty}
                            </Text>
                          </View>
                        </View>
                        
                        {currentQ.options.map((option, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.optionButton,
                              selectedAnswer === index && styles.selectedOption,
                              showResult && index === currentQ.correct_answer && styles.correctOption,
                              showResult && selectedAnswer === index && index !== currentQ.correct_answer && styles.wrongOption,
                            ]}
                            onPress={() => handleAnswerSelect(index)}
                            disabled={showResult}
                            activeOpacity={0.8}
                          >
                            <Text style={[
                              styles.optionText,
                              selectedAnswer === index && styles.selectedOptionText,
                              showResult && index === currentQ.correct_answer && styles.correctOptionText,
                            ]}>
                              {option}
                            </Text>
                            {showResult && index === currentQ.correct_answer && (
                              <CheckCircle size={18} color="#10B981" />
                            )}
                            {showResult && selectedAnswer === index && index !== currentQ.correct_answer && (
                              <XCircle size={18} color="#EF4444" />
                            )}
                          </TouchableOpacity>
                        ))}

                        {/* Explanation */}
                        {showResult && (
                          <View style={styles.explanationContainer}>
                            <LinearGradient
                              colors={['#374151', '#1F2937']}
                              style={styles.explanationGradient}
                            >
                              <Text style={styles.explanationTitle}>💡 Explanation</Text>
                              <Text style={styles.explanationText}>{currentQ.explanation}</Text>
                            </LinearGradient>
                          </View>
                        )}

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                          {!showResult ? (
                            <TouchableOpacity
                              style={styles.submitButton}
                              onPress={handleSubmitAnswer}
                              disabled={selectedAnswer === null}
                              activeOpacity={0.8}
                            >
                              <LinearGradient
                                colors={selectedAnswer !== null ? ['#40E0FF', '#1E40AF'] : ['#374151', '#1F2937']}
                                style={styles.submitButtonGradient}
                              >
                                <Text style={[
                                  styles.submitButtonText,
                                  selectedAnswer === null && styles.submitButtonTextDisabled
                                ]}>
                                  Submit Answer
                                </Text>
                              </LinearGradient>
                            </TouchableOpacity>
                          ) : isQuizComplete ? (
                            <View style={styles.quizCompleteContainer}>
                              <View style={styles.finalScoreContainer}>
                                <Trophy size={28} color="#F59E0B" />
                                <Text style={styles.finalScoreText}>
                                  Final Score: {score}/{questions.length}
                                </Text>
                                <Text style={[
                                  styles.performanceText,
                                  { color: getScoreMessage(score, questions.length).color }
                                ]}>
                                  {getScoreMessage(score, questions.length).message}
                                </Text>
                              </View>
                              <TouchableOpacity style={styles.restartButton} onPress={handleRestartQuiz} activeOpacity={0.8}>
                                <LinearGradient
                                  colors={['#40E0FF', '#1E40AF']}
                                  style={styles.restartButtonGradient}
                                >
                                  <RotateCcw size={14} color="#FFFFFF" />
                                  <Text style={styles.restartButtonText}>Try Again</Text>
                                </LinearGradient>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion} activeOpacity={0.8}>
                              <LinearGradient
                                colors={['#10B981', '#059669']}
                                style={styles.nextButtonGradient}
                              >
                                <Text style={styles.nextButtonText}>Next Question</Text>
                                <ChevronRight size={14} color="#FFFFFF" />
                              </LinearGradient>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.quizIntro}>
                    <Zap size={40} color="#40E0FF" />
                    <Text style={styles.quizIntroTitle}>Test Your Legal Knowledge</Text>
                    <Text style={styles.quizIntroText}>
                      Challenge yourself with questions covering various aspects of Indian law. 
                      Perfect for students, professionals, and curious citizens!
                    </Text>
                    <View style={styles.quizFeatures}>
                      <Text style={styles.featureText}>• Constitutional Law</Text>
                      <Text style={styles.featureText}>• Criminal Procedures</Text>
                      <Text style={styles.featureText}>• Traffic Regulations</Text>
                      <Text style={styles.featureText}>• Civil Rights</Text>
                    </View>
                  </View>
                )}
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Laws Library */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Laws Library</Text>
              <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
                <Filter size={14} color="#40E0FF" />
              </TouchableOpacity>
            </View>

            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryFilterButton,
                    selectedCategory === category && styles.categoryFilterButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.categoryFilterText,
                    selectedCategory === category && styles.categoryFilterTextActive
                  ]}>
                    {category === 'all' ? 'All Laws' : category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Laws List */}
            <View style={styles.lawsContainer}>
              {filteredLaws.slice(0, 10).map((law) => (
                <TouchableOpacity
                  key={law.id}
                  style={styles.lawCard}
                  onPress={() => handleLawPress(law)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#1F2937', '#111827']}
                    style={styles.lawCardGradient}
                  >
                    <View style={styles.lawHeader}>
                      <Text style={styles.lawTitle} numberOfLines={2}>{law.title}</Text>
                      <View style={[styles.severityBadge, { backgroundColor: `${getSeverityColor(law.severity)}20` }]}>
                        <Text style={[styles.severityText, { color: getSeverityColor(law.severity) }]}>
                          {law.severity}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.lawDescription} numberOfLines={2}>{law.description}</Text>
                    <View style={styles.lawFooter}>
                      <Text style={styles.lawCategory}>{law.category}</Text>
                      <ChevronRight size={14} color="#6B7280" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: width < 380 ? 16 : 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: width < 380 ? 24 : 28,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: width < 380 ? 18 : 20,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  playText: {
    fontSize: 12,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  filterButton: {
    padding: 6,
    backgroundColor: '#40E0FF20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#40E0FF40',
  },
  pathsContainer: {
    marginBottom: 25,
  },
  pathCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  pathCardGradient: {
    padding: width < 380 ? 16 : 18,
    borderWidth: 1,
    borderColor: '#374151',
  },
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pathIcon: {
    width: width < 380 ? 36 : 40,
    height: width < 380 ? 36 : 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    fontSize: width < 380 ? 16 : 18,
    fontFamily: 'Orbitron-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pathDuration: {
    fontSize: width < 380 ? 11 : 12,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Bold',
    color: '#FFFFFF',
    minWidth: 35,
    textAlign: 'right',
  },
  quizCard: {
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  quizCardGradient: {
    padding: width < 380 ? 16 : 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  quizIntro: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  quizIntroTitle: {
    fontSize: width < 380 ? 18 : 20,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  quizIntroText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  quizFeatures: {
    alignItems: 'flex-start',
  },
  featureText: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#40E0FF',
    marginBottom: 4,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#9CA3AF',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Bold',
    color: '#40E0FF',
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  quizProgressFill: {
    height: '100%',
    backgroundColor: '#40E0FF',
    borderRadius: 2,
  },
  questionContainer: {
    marginTop: 8,
  },
  questionHeader: {
    marginBottom: 16,
  },
  question: {
    fontSize: width < 380 ? 16 : 18,
    fontFamily: 'Orbitron-Medium',
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 24,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'Rajdhani-Bold',
    textTransform: 'uppercase',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: width < 380 ? 12 : 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  selectedOption: {
    backgroundColor: '#40E0FF20',
    borderColor: '#40E0FF',
  },
  correctOption: {
    backgroundColor: '#10B98120',
    borderColor: '#10B981',
  },
  wrongOption: {
    backgroundColor: '#EF444420',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Medium',
    color: '#FFFFFF',
    flex: 1,
  },
  selectedOptionText: {
    color: '#40E0FF',
    fontFamily: 'Rajdhani-SemiBold',
  },
  correctOptionText: {
    color: '#10B981',
    fontFamily: 'Rajdhani-SemiBold',
  },
  explanationContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  explanationGradient: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  explanationTitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-Bold',
    color: '#40E0FF',
    marginBottom: 6,
  },
  explanationText: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  actionButtons: {
    marginTop: 20,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
  },
  submitButtonTextDisabled: {
    color: '#6B7280',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginRight: 6,
  },
  quizCompleteContainer: {
    alignItems: 'center',
  },
  finalScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  finalScoreText: {
    fontSize: width < 380 ? 18 : 20,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  performanceText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-SemiBold',
    textAlign: 'center',
  },
  restartButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  restartButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  restartButtonText: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: '#374151',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  categoryFilterButtonActive: {
    backgroundColor: '#40E0FF20',
    borderColor: '#40E0FF',
  },
  categoryFilterText: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  categoryFilterTextActive: {
    color: '#40E0FF',
    fontFamily: 'Rajdhani-SemiBold',
  },
  lawsContainer: {
    marginBottom: 25,
  },
  lawCard: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  lawCardGradient: {
    padding: width < 380 ? 12 : 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  lawHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  lawTitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Orbitron-SemiBold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
    lineHeight: 18,
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 9,
    fontFamily: 'Rajdhani-Bold',
    textTransform: 'uppercase',
  },
  lawDescription: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    marginBottom: 10,
    lineHeight: 16,
  },
  lawFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lawCategory: {
    fontSize: width < 380 ? 11 : 12,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#40E0FF',
  },
  bottomSpacing: {
    height: 100,
  },
});