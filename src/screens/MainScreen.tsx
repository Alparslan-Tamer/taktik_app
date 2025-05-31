import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Alert,
    Modal,
    TextInput,
    SafeAreaView,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { HeaderBar } from '../components/HeaderBar';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { BottomTabBar } from '../components/BottomTabBar';
import { StudyTargetCard } from '../components/StudyTargetCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '../context/ProfileContext';
import { RootStackParamList } from '../types/navigation';

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface StudyTarget {
    subject: string;
    topic: string;
    targetCount: number;
    date: string;
    completed: boolean;
    duration?: number;
    timerState?: {
        isRunning: boolean;
        isPaused: boolean;
        startTime: number;
        elapsedTime: number;
    };
}

export const MainScreen = () => {
    const navigation = useNavigation<MainScreenNavigationProp>();
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [dailyTargets, setDailyTargets] = useState<StudyTarget[]>([]);
    const [dailyQuestionCount, setDailyQuestionCount] = useState(0);
    const [dailyDuration, setDailyDuration] = useState(0);
    const animatedValues = useRef<{ [key: string]: Animated.Value }>({});
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [showDurationModal, setShowDurationModal] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState<StudyTarget | null>(null);
    const [manualDuration, setManualDuration] = useState('');
    const { profile } = useProfile();

    useFocusEffect(
        React.useCallback(() => {
            loadDailyTargets();
            loadDailyProgress();
            return () => {
                if (timerInterval) {
                    clearInterval(timerInterval);
                }
            };
        }, [selectedDate])
    );

    const loadDailyTargets = async () => {
        try {
            const storageKey = `${profile?.name}_study_targets`;
            const targets = await AsyncStorage.getItem(storageKey);
            if (targets) {
                const allTargets = JSON.parse(targets);
                const dateTargets = allTargets.filter((target: StudyTarget) => target.date === selectedDate);
                setDailyTargets(dateTargets);

                // Initialize animation values for all targets
                dateTargets.forEach((target: StudyTarget, index: number) => {
                    if (!animatedValues.current[index]) {
                        animatedValues.current[index] = new Animated.Value(target.completed ? 1 : 0);
                    } else {
                        animatedValues.current[index].setValue(target.completed ? 1 : 0);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading targets:', error);
        }
    };

    const getAnimatedValue = (index: number) => {
        if (!animatedValues.current[index]) {
            animatedValues.current[index] = new Animated.Value(0);
        }
        return animatedValues.current[index];
    };

    const formatDuration = (target: StudyTarget): string => {
        if (!target.timerState) {
            if (target.duration !== undefined) {
                return `${target.duration} dk`;
            }
            return '0 dk';
        }

        // Timer aktif ise saat:dakika:saniye formatında göster
        const totalMilliseconds = target.timerState.isPaused
            ? target.timerState.elapsedTime
            : Date.now() - target.timerState.startTime;

        const totalSeconds = Math.floor(totalMilliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatTotalDuration = (minutes: number): string => {
        return `${minutes} dk`;
    };

    const updateTimer = () => {
        setDailyTargets(prevTargets => {
            return prevTargets.map(target => {
                if (target.timerState?.isRunning && !target.timerState.isPaused) {
                    const now = Date.now();
                    const elapsed = now - target.timerState.startTime;
                    return {
                        ...target,
                        timerState: {
                            ...target.timerState,
                            elapsedTime: elapsed
                        }
                    };
                }
                return target;
            });
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const hasRunningTimer = dailyTargets.some(target =>
                target.timerState?.isRunning && !target.timerState.isPaused
            );
            if (hasRunningTimer) {
                updateTimer();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [dailyTargets]);

    const handlePlay = (target: StudyTarget) => {
        // Check if the target is from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(target.date);
        targetDate.setHours(0, 0, 0, 0);

        if (targetDate.getTime() !== today.getTime()) {
            Alert.alert('Uyarı', 'Sadece bugünün hedefleri için zamanlayıcı başlatılabilir.');
            return;
        }

        // Check if any other timer exists (running or paused)
        const isAnyTimerActive = dailyTargets.some(t =>
            t !== target && t.timerState
        );

        if (isAnyTimerActive) {
            Alert.alert('Uyarı', 'Başka bir hedefin zamanlayıcısı aktif. Lütfen önce diğer zamanlayıcıyı durdurun.');
            return;
        }

        const updatedTargets = dailyTargets.map(t => {
            if (t === target) {
                const currentElapsed = t.timerState?.elapsedTime || 0;
                return {
                    ...t,
                    timerState: {
                        isRunning: true,
                        isPaused: false,
                        startTime: Date.now() - currentElapsed,
                        elapsedTime: currentElapsed
                    }
                };
            }
            return t;
        });
        setDailyTargets(updatedTargets);
    };

    const handlePause = (target: StudyTarget) => {
        // Check if the target is from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(target.date);
        targetDate.setHours(0, 0, 0, 0);

        if (targetDate.getTime() !== today.getTime()) {
            return;
        }

        const updatedTargets = dailyTargets.map(t => {
            if (t === target && t.timerState) {
                const currentElapsed = Date.now() - t.timerState.startTime;
                return {
                    ...t,
                    timerState: {
                        ...t.timerState,
                        isPaused: true,
                        elapsedTime: currentElapsed
                    }
                };
            }
            return t;
        });
        setDailyTargets(updatedTargets);
    };

    const handleStop = async (target: StudyTarget) => {
        try {
            // Check if the target is from today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const targetDate = new Date(target.date);
            targetDate.setHours(0, 0, 0, 0);

            if (targetDate.getTime() !== today.getTime()) {
                Alert.alert('Uyarı', 'Sadece bugünün hedefleri için zamanlayıcı durdurulabilir.');
                return;
            }

            if (!target.timerState?.isRunning) return;

            const elapsedMilliseconds = target.timerState.isPaused
                ? target.timerState.elapsedTime
                : Date.now() - target.timerState.startTime;

            // Minimum 1 dakika olacak şekilde hesapla
            const elapsedMinutes = Math.max(1, Math.floor(elapsedMilliseconds / 60000));

            // Update target with the elapsed duration
            const updatedTargets = dailyTargets.map(t => {
                if (t === target) {
                    return {
                        ...t,
                        duration: elapsedMinutes,
                        timerState: undefined
                    };
                }
                return t;
            });

            // Save to AsyncStorage
            const storageKey = `${profile?.name}_study_targets`;
            const targets = await AsyncStorage.getItem(storageKey);
            if (targets) {
                const allTargets = JSON.parse(targets);
                const updatedAllTargets = allTargets.map((t: StudyTarget) => {
                    if (t.date === target.date && t.subject === target.subject &&
                        t.topic === target.topic && t.targetCount === target.targetCount) {
                        return {
                            ...t,
                            duration: elapsedMinutes,
                            timerState: undefined
                        };
                    }
                    return t;
                });
                await AsyncStorage.setItem(storageKey, JSON.stringify(updatedAllTargets));
            }

            setDailyTargets(updatedTargets);
        } catch (error) {
            console.error('Error stopping timer:', error);
            Alert.alert('Hata', 'Zamanlayıcı durdurulurken bir hata oluştu');
        }
    };

    const handleCompleteTarget = async (target: StudyTarget) => {
        try {
            // Check if the target is from today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const targetDate = new Date(target.date);
            targetDate.setHours(0, 0, 0, 0);

            if (targetDate.getTime() !== today.getTime()) {
                Alert.alert('Uyarı', 'Sadece bugünün hedefleri tamamlanabilir.');
                return;
            }

            // If target is already completed, ask for confirmation to uncomplete
            if (target.completed) {
                Alert.alert(
                    'Hedefi Geri Al',
                    'Bu hedefi tamamlanmamış olarak işaretlemek istediğinizden emin misiniz?',
                    [
                        {
                            text: 'İptal',
                            style: 'cancel',
                        },
                        {
                            text: 'Evet',
                            onPress: async () => {
                                // Update target as uncompleted
                                const updatedTargets = dailyTargets.map(t => {
                                    if (t === target) {
                                        return {
                                            ...t,
                                            completed: false,
                                            duration: undefined,
                                            timerState: undefined
                                        };
                                    }
                                    return t;
                                });

                                // Update study_targets in AsyncStorage
                                const storageKey = `${profile?.name}_study_targets`;
                                const targets = await AsyncStorage.getItem(storageKey);
                                if (targets) {
                                    const allTargets = JSON.parse(targets);
                                    const updatedAllTargets = allTargets.map((t: StudyTarget) => {
                                        if (t.date === target.date && t.subject === target.subject &&
                                            t.topic === target.topic && t.targetCount === target.targetCount) {
                                            return {
                                                ...t,
                                                completed: false,
                                                duration: undefined
                                            };
                                        }
                                        return t;
                                    });
                                    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedAllTargets));
                                }

                                // Remove the progress record
                                const progressKey = `${profile?.name}_progress_${selectedDate}`;
                                const existingProgress = await AsyncStorage.getItem(progressKey);
                                if (existingProgress) {
                                    const progress = JSON.parse(existingProgress);
                                    const filteredProgress = progress.filter((record: any) =>
                                        !(record.subject === target.subject &&
                                            record.topic === target.topic &&
                                            record.questionCount === target.targetCount)
                                    );
                                    await AsyncStorage.setItem(progressKey, JSON.stringify(filteredProgress));
                                }

                                // Update UI
                                setDailyTargets(updatedTargets);
                                loadDailyProgress();
                            }
                        }
                    ]
                );
                return;
            }

            // If timer is running, get elapsed time
            let finalDuration = target.duration || 0;
            if (target.timerState?.isRunning) {
                const elapsedMilliseconds = target.timerState.isPaused
                    ? target.timerState.elapsedTime
                    : Date.now() - target.timerState.startTime;
                const elapsedMinutes = Math.floor(elapsedMilliseconds / 60000);
                finalDuration = elapsedMinutes;
            }

            // If no timer/duration, show modal to enter manually
            if (!target.timerState && !target.duration) {
                setSelectedTarget(target);
                setShowDurationModal(true);
                return;
            }

            // Update target as completed with duration
            const updatedTargets = dailyTargets.map(t => {
                if (t === target) {
                    return {
                        ...t,
                        completed: true,
                        duration: finalDuration,
                        timerState: undefined
                    };
                }
                return t;
            });

            // Update study_targets in AsyncStorage
            const storageKey = `${profile?.name}_study_targets`;
            const targets = await AsyncStorage.getItem(storageKey);
            if (targets) {
                const allTargets = JSON.parse(targets);
                const updatedAllTargets = allTargets.map((t: StudyTarget) => {
                    if (t.date === target.date && t.subject === target.subject &&
                        t.topic === target.topic && t.targetCount === target.targetCount) {
                        return {
                            ...t,
                            completed: true,
                            duration: finalDuration,
                        };
                    }
                    return t;
                });
                await AsyncStorage.setItem(storageKey, JSON.stringify(updatedAllTargets));
            }

            // Save the progress record
            const progressKey = `${profile?.name}_progress_${selectedDate}`;
            const existingProgress = await AsyncStorage.getItem(progressKey);
            const progress = existingProgress ? JSON.parse(existingProgress) : [];

            const newRecord = {
                subject: target.subject,
                topic: target.topic,
                questionCount: target.targetCount,
                duration: finalDuration,
                timestamp: new Date().toISOString(),
            };

            progress.push(newRecord);
            await AsyncStorage.setItem(progressKey, JSON.stringify(progress));

            // Update UI
            setDailyTargets(updatedTargets);
            loadDailyProgress();
        } catch (error) {
            console.error('Error completing target:', error);
            Alert.alert('Hata', 'Hedef tamamlanırken bir hata oluştu');
        }
    };

    const handleManualDurationSubmit = () => {
        if (!selectedTarget) {
            setShowDurationModal(false);
            return;
        }

        const duration = Math.max(1, parseInt(manualDuration, 10));
        if (isNaN(duration)) {
            Alert.alert('Hata', 'Lütfen geçerli bir süre girin');
            return;
        }

        // Complete target with manual duration
        const updatedTargets = dailyTargets.map(t => {
            if (t === selectedTarget) {
                return {
                    ...t,
                    duration,
                    timerState: undefined
                };
            }
            return t;
        });

        // Save to AsyncStorage
        AsyncStorage.getItem(`${profile?.name}_study_targets`)
            .then(targets => {
                if (targets) {
                    const allTargets = JSON.parse(targets);
                    const updatedAllTargets = allTargets.map((t: StudyTarget) => {
                        if (t.date === selectedTarget.date &&
                            t.subject === selectedTarget.subject &&
                            t.topic === selectedTarget.topic &&
                            t.targetCount === selectedTarget.targetCount) {
                            return {
                                ...t,
                                duration,
                                timerState: undefined
                            };
                        }
                        return t;
                    });
                    return AsyncStorage.setItem(`${profile?.name}_study_targets`, JSON.stringify(updatedAllTargets));
                }
            })
            .then(() => {
                setDailyTargets(updatedTargets);
                setShowDurationModal(false);
                setManualDuration('');
                setSelectedTarget(null);
            })
            .catch(error => {
                console.error('Error saving manual duration:', error);
                Alert.alert('Hata', 'Süre kaydedilirken bir hata oluştu');
            });
    };

    const loadDailyProgress = async () => {
        try {
            const progressKey = `${profile?.name}_progress_${selectedDate}`;
            const progress = await AsyncStorage.getItem(progressKey);
            if (progress) {
                const records = JSON.parse(progress);
                const totalQuestions = records.reduce((sum: number, record: any) => sum + record.questionCount, 0);
                const totalDuration = records.reduce((sum: number, record: any) => sum + record.duration, 0);
                setDailyQuestionCount(totalQuestions);
                setDailyDuration(totalDuration);
            } else {
                setDailyQuestionCount(0);
                setDailyDuration(0);
            }
        } catch (error) {
            console.error('Error loading daily progress:', error);
        }
    };

    const handleDeleteTarget = async (index: number) => {
        try {
            const target = dailyTargets[index];
            if (target.completed) {
                Alert.alert('Uyarı', 'Tamamlanmış hedefler silinemez.');
                return;
            }

            Alert.alert(
                'Hedefi Sil',
                'Bu hedefi silmek istediğinizden emin misiniz?',
                [
                    {
                        text: 'İptal',
                        style: 'cancel',
                    },
                    {
                        text: 'Sil',
                        style: 'destructive',
                        onPress: async () => {
                            const updatedTargets = [...dailyTargets];
                            updatedTargets.splice(index, 1);
                            setDailyTargets(updatedTargets);

                            const storageKey = `${profile?.name}_study_targets`;
                            const targets = await AsyncStorage.getItem(storageKey);
                            if (targets) {
                                const allTargets = JSON.parse(targets);
                                const targetToDelete = dailyTargets[index];
                                const filteredTargets = allTargets.filter(
                                    (t: StudyTarget) =>
                                        !(
                                            t.date === targetToDelete.date &&
                                            t.subject === targetToDelete.subject &&
                                            t.topic === targetToDelete.topic &&
                                            t.targetCount === targetToDelete.targetCount
                                        )
                                );
                                await AsyncStorage.setItem(storageKey, JSON.stringify(filteredTargets));
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error deleting target:', error);
            Alert.alert('Hata', 'Hedef silinirken bir hata oluştu');
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) {
            return 'Bugün';
        }

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('tr-TR', options);
    };

    const navigateDate = (offset: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + offset);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
    };

    const isToday = (date: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj.getTime() === today.getTime();
    };

    const isFutureOrToday = (date: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj.getTime() >= today.getTime();
    };

    const isFuture = (date: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj.getTime() > today.getTime();
    };

    // Add useEffect to reload data when date changes
    useEffect(() => {
        loadDailyTargets();
        loadDailyProgress();
    }, [selectedDate]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Header */}
            <View style={styles.header}>
                <LinearGradient
                    colors={[COLORS.primary, COLORS.darkPurple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerTop}>
                        <View style={styles.dateSelector}>
                            <TouchableOpacity
                                onPress={() => navigateDate(-1)}
                                style={styles.dateNavButton}
                            >
                                <Ionicons
                                    name="chevron-back"
                                    size={24}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>

                            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>

                            <TouchableOpacity
                                onPress={() => navigateDate(1)}
                                style={styles.dateNavButton}
                            >
                                <Ionicons
                                    name="chevron-forward"
                                    size={24}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{dailyQuestionCount}</Text>
                            <Text style={styles.statLabel}>Soru</Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{formatTotalDuration(dailyDuration)}</Text>
                            <Text style={styles.statLabel}>Süre</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Main Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.targetsHeader}>
                    <Text style={styles.sectionTitle}>Günlük Hedeflerim</Text>

                    {isFutureOrToday(selectedDate) && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigation.navigate('StudyPlan', { selectedDate })}
                        >
                            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
                            <Text style={styles.addButtonText}>Hedef Ekle</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {dailyTargets.length === 0 ? (
                    <Card style={styles.emptyStateCard}>
                        <View style={styles.emptyState}>
                            <Ionicons name="calendar-outline" size={64} color={COLORS.lightPurple} />
                            <Text style={styles.emptyStateTitle}>Hedef Bulunamadı</Text>
                            <Text style={styles.emptyStateText}>
                                {isFutureOrToday(selectedDate)
                                    ? 'Bu gün için henüz bir çalışma hedefi belirlemediniz. Yeni bir hedef eklemek için sağ üst köşedeki butonu kullanabilirsiniz.'
                                    : 'Bu tarih için belirlenmiş bir çalışma hedefi bulunmuyor.'}
                            </Text>
                        </View>
                    </Card>
                ) : (
                    <View style={styles.targetsList}>
                        {dailyTargets.map((target, index) => (
                            <StudyTargetCard
                                key={`${target.subject}-${target.topic}-${index}`}
                                target={target}
                                onPlay={() => handlePlay(target)}
                                onPause={() => handlePause(target)}
                                onStop={() => handleStop(target)}
                                onComplete={() => handleCompleteTarget(target)}
                                onDelete={() => handleDeleteTarget(index)}
                                formatDuration={(t) => formatDuration(t)}
                                disabled={!isToday(selectedDate) || (target.completed && !isToday(selectedDate))}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Bottom Tab Bar */}
            <BottomTabBar activeScreen="Main" onTabPress={(screen) => navigation.navigate(screen as never)} />

            {/* Duration Modal */}
            <Modal
                visible={showDurationModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDurationModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Süre Girin</Text>
                        <Text style={styles.modalSubtitle}>
                            {selectedTarget?.subject} - {selectedTarget?.topic}
                        </Text>

                        <TextInput
                            style={styles.durationInput}
                            placeholder="Dakika olarak süre"
                            keyboardType="number-pad"
                            value={manualDuration}
                            onChangeText={setManualDuration}
                            autoFocus
                        />

                        <View style={styles.modalActions}>
                            <Button
                                title="İptal"
                                onPress={() => setShowDurationModal(false)}
                                variant="outline"
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <Button
                                title="Kaydet"
                                onPress={handleManualDurationSubmit}
                                style={{ flex: 1, marginLeft: 8 }}
                            />
                        </View>
                    </Card>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        width: '100%',
        overflow: 'hidden',
    },
    headerGradient: {
        paddingTop: 40, // Adjusted for status bar
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
        marginBottom: 16,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SIZES.padding,
        marginBottom: 16,
    },
    dateNavButton: {
        padding: 8,
    },
    dateText: {
        ...FONTS.h3,
        color: COLORS.white,
        flex: 1,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: SIZES.padding,
    },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: SIZES.radius,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        minWidth: 100,
    },
    statValue: {
        ...FONTS.h2,
        color: COLORS.white,
        fontWeight: '700',
    },
    statLabel: {
        ...FONTS.body3,
        color: COLORS.white,
        opacity: 0.8,
    },
    content: {
        flex: 1,
        backgroundColor: COLORS.background,
        marginTop: -20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    scrollContent: {
        paddingHorizontal: SIZES.padding,
        paddingTop: 30,
        paddingBottom: 100, // Extra space for bottom tab bar
    },
    targetsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        ...FONTS.h2,
        color: COLORS.text,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButtonText: {
        ...FONTS.body3,
        color: COLORS.primary,
        marginLeft: 4,
    },
    emptyStateCard: {
        padding: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        alignItems: 'center',
        padding: SIZES.padding,
    },
    emptyStateTitle: {
        ...FONTS.h3,
        color: COLORS.text,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    targetsList: {
        paddingBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        padding: SIZES.padding,
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radius,
    },
    modalTitle: {
        ...FONTS.h3,
        color: COLORS.text,
        marginBottom: 8,
    },
    modalSubtitle: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    durationInput: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        padding: 12,
        marginBottom: 16,
        ...FONTS.body2,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
}); 