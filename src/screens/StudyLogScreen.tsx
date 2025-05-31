import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { BottomTabBar } from '../components/BottomTabBar';
import { Card } from '../components/Card';
import { useProfile } from '../context/ProfileContext';

interface StudyRecord {
    subject: string;
    topic: string;
    questionCount: number;
    duration: number;
    timestamp: string;
}

interface DailyStudyLog {
    date: string;
    records: StudyRecord[];
    totalQuestions: number;
    totalDuration: number;
}

export const StudyLogScreen = () => {
    const navigation = useNavigation();
    const [studyLogs, setStudyLogs] = useState<DailyStudyLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { profile } = useProfile();
    const DAYS_PER_PAGE = 7;

    useEffect(() => {
        loadInitialStudyLogs();
    }, []);

    const loadInitialStudyLogs = async () => {
        setIsLoading(true);
        await loadStudyLogs(1);
        setIsLoading(false);
    };

    const loadStudyLogs = async (page: number) => {
        try {
            const startDay = (page - 1) * DAYS_PER_PAGE;
            const logs: DailyStudyLog[] = [];

            console.log('Loading page:', page, 'starting from day:', startDay);

            // Load current page data
            for (let i = startDay; i < startDay + DAYS_PER_PAGE; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;

                const progressKey = `${profile?.name}_progress_${dateStr}`;
                const progress = await AsyncStorage.getItem(progressKey);

                if (progress) {
                    console.log('Found data for date:', dateStr);
                    const records: StudyRecord[] = JSON.parse(progress);
                    const totalQuestions = records.reduce((sum, record) => sum + record.questionCount, 0);
                    const totalDuration = records.reduce((sum, record) => sum + record.duration, 0);

                    logs.push({
                        date: dateStr,
                        records,
                        totalQuestions,
                        totalDuration
                    });
                } else {
                    console.log('No data for date:', dateStr);
                    logs.push({
                        date: dateStr,
                        records: [],
                        totalQuestions: 0,
                        totalDuration: 0
                    });
                }
            }

            // Check for more data in the past
            let hasMoreData = false;
            for (let i = startDay + DAYS_PER_PAGE; i < startDay + DAYS_PER_PAGE + 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const checkKey = `${profile?.name}_progress_${year}-${month}-${day}`;
                const checkProgress = await AsyncStorage.getItem(checkKey);

                if (checkProgress) {
                    console.log('Found more data at:', year, month, day);
                    hasMoreData = true;
                    break;
                }
            }

            console.log('Has more data:', hasMoreData);
            setHasMore(hasMoreData);

            if (page === 1) {
                console.log('Setting initial logs:', logs.length);
                setStudyLogs(logs);
            } else {
                console.log('Appending logs:', logs.length);
                setStudyLogs(prevLogs => [...prevLogs, ...logs]);
            }
        } catch (error) {
            console.error('Error loading study logs:', error);
        }
    };

    const handleLoadMore = async () => {
        console.log('Load more pressed, current page:', currentPage);
        if (isLoadingMore || !hasMore) {
            console.log('Cannot load more:', { isLoadingMore, hasMore });
            return;
        }

        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        console.log('Loading next page:', nextPage);
        await loadStudyLogs(nextPage);
        setCurrentPage(nextPage);
        setIsLoadingMore(false);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.getTime() === today.getTime()) {
            return 'Bugün';
        } else if (date.getTime() === yesterday.getTime()) {
            return 'Dün';
        }

        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        };
        return date.toLocaleDateString('tr-TR', options);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <LinearGradient
                    colors={[COLORS.primary, COLORS.darkPurple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Çalışma Kayıtları</Text>
                    <Text style={styles.headerSubtitle}>Günlük çalışma istatistikleriniz</Text>
                </LinearGradient>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <LinearGradient
                colors={[COLORS.primary, COLORS.darkPurple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Çalışma Kayıtları</Text>
                <Text style={styles.headerSubtitle}>Günlük çalışma istatistikleriniz</Text>
            </LinearGradient>

            <View style={[styles.content, styles.mainContainer]}>
                <ScrollView
                    style={styles.scrollContent}
                    contentContainerStyle={styles.scrollContentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {studyLogs.map((dayLog, dayIndex) => (
                        <View key={dayLog.date} style={styles.dayContainer}>
                            <View style={styles.dateHeader}>
                                <View style={styles.dateLine}>
                                    <View style={styles.dateCircle} />
                                    <View style={[
                                        styles.dateConnector,
                                        dayIndex === studyLogs.length - 1 && !hasMore && styles.lastDateConnector
                                    ]} />
                                </View>

                                <View style={styles.dateContent}>
                                    <Text style={styles.dateText}>{formatDate(dayLog.date)}</Text>
                                    {dayLog.records.length > 0 && (
                                        <View style={styles.dailyStats}>
                                            <View style={styles.statItem}>
                                                <Ionicons
                                                    name="help-circle-outline"
                                                    size={16}
                                                    color={COLORS.primary}
                                                />
                                                <Text style={styles.statItemText}>{dayLog.totalQuestions} Soru</Text>
                                            </View>
                                            <View style={styles.statItem}>
                                                <Ionicons
                                                    name="time-outline"
                                                    size={16}
                                                    color={COLORS.primary}
                                                />
                                                <Text style={styles.statItemText}>{dayLog.totalDuration} dk</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {dayLog.records.length === 0 ? (
                                <Card style={styles.emptyCard}>
                                    <Text style={styles.emptyText}>Bu tarihte çalışma kaydı yok</Text>
                                </Card>
                            ) : (
                                dayLog.records.map((record, index) => (
                                    <Card key={index} style={styles.recordCard}>
                                        <View style={styles.recordHeader}>
                                            <View style={styles.recordSubject}>
                                                <Text style={styles.subjectText}>{record.subject}</Text>
                                                <Text style={styles.topicText}>{record.topic}</Text>
                                            </View>
                                            <Text style={styles.timeText}>{formatTime(record.timestamp)}</Text>
                                        </View>

                                        <View style={styles.recordStats}>
                                            <View style={styles.statItem}>
                                                <Ionicons name="help-circle-outline" size={16} color={COLORS.primary} />
                                                <Text style={styles.statItemText}>{record.questionCount} Soru</Text>
                                            </View>
                                            <View style={styles.statItem}>
                                                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                                                <Text style={styles.statItemText}>{record.duration} dk</Text>
                                            </View>
                                        </View>
                                    </Card>
                                ))
                            )}
                        </View>
                    ))}

                    {hasMore && (
                        <TouchableOpacity
                            style={styles.loadMoreButton}
                            onPress={handleLoadMore}
                            disabled={isLoadingMore}
                        >
                            {isLoadingMore ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <>
                                    <Text style={styles.loadMoreText}>Daha Fazla Göster</Text>
                                    <Ionicons name="chevron-down" size={20} color={COLORS.white} />
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            <View style={styles.bottomTabContainer}>
                <BottomTabBar
                    activeScreen="StudyLog"
                    onTabPress={(screen) => navigation.navigate(screen as never)}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SIZES.padding,
        paddingTop: SIZES.padding * 2,
        paddingBottom: SIZES.padding * 2.5,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        ...FONTS.h2,
        color: COLORS.white,
        marginBottom: SIZES.base * 1.5,
    },
    headerSubtitle: {
        ...FONTS.body2,
        color: COLORS.white,
        opacity: 0.8,
        marginBottom: SIZES.base,
    },
    content: {
        flex: 1,
        marginTop: -35,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    mainContainer: {
        flex: 1,
    },
    bottomTabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        padding: SIZES.padding,
        paddingBottom: 90,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayContainer: {
        marginBottom: SIZES.padding,
    },
    dateHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SIZES.base,
    },
    dateLine: {
        width: 24,
        alignItems: 'center',
        marginRight: SIZES.base,
    },
    dateCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        marginTop: SIZES.base,
    },
    dateConnector: {
        width: 2,
        height: '100%',
        backgroundColor: COLORS.textSecondary,
        position: 'absolute',
        top: SIZES.padding,
        left: '50%',
        marginLeft: -1,
    },
    lastDateConnector: {
        display: 'none',
    },
    dateContent: {
        flex: 1,
    },
    dateText: {
        ...FONTS.h3,
        color: COLORS.text,
        marginBottom: SIZES.base,
    },
    dailyStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.base,
        backgroundColor: COLORS.backgroundSecondary,
        padding: SIZES.base,
        borderRadius: SIZES.radius,
    },
    emptyCard: {
        marginLeft: SIZES.padding,
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        opacity: 0.7,
    },
    emptyText: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SIZES.padding,
    },
    recordCard: {
        marginLeft: SIZES.padding,
        marginBottom: SIZES.base,
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        ...SHADOWS.medium,
    },
    recordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SIZES.base,
    },
    recordSubject: {
        flex: 1,
    },
    subjectText: {
        ...FONTS.h4,
        color: COLORS.text,
    },
    topicText: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        marginTop: SIZES.base,
    },
    timeText: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
    },
    recordStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SIZES.base,
    },
    statItemText: {
        marginLeft: SIZES.base,
        color: COLORS.textSecondary,
        ...FONTS.body2,
    },
    loadMoreButton: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SIZES.padding,
        ...SHADOWS.medium,
    },
    loadMoreText: {
        ...FONTS.h4,
        color: COLORS.white,
        marginRight: SIZES.base,
    },
    statLabel: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        marginTop: SIZES.base,
    },
    recordItem: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        marginBottom: SIZES.padding,
        padding: SIZES.padding,
        ...SHADOWS.medium,
    },
}); 