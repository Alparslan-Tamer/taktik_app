import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Modal,
    SafeAreaView,
    StatusBar,
    FlatList
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { GRADE_SUBJECTS } from '../constants';
import { useUser } from '../context/UserContext';
import { GradeLevel } from '../types';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { HeaderBar } from '../components/HeaderBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { useProfile } from '../context/ProfileContext';

type RootStackParamList = {
    Main: undefined;
    StudyPlan: { selectedDate?: string };
};

type StudyPlanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'StudyPlan'>;
type StudyPlanScreenRouteProp = RouteProp<RootStackParamList, 'StudyPlan'>;

interface StudyTarget {
    subject: string;
    topic: string;
    targetCount: number;
    date: string;
    completed: boolean;
}

interface Subject {
    subject: string;
    topics: string[];
}

export const StudyPlanScreen = () => {
    const navigation = useNavigation<StudyPlanScreenNavigationProp>();
    const route = useRoute<StudyPlanScreenRouteProp>();
    const { educationLevel, gradeLevel } = useUser();
    const { profile } = useProfile();
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [targetCount, setTargetCount] = useState('');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [topics, setTopics] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const date = new Date(route.params?.selectedDate || new Date());
        date.setHours(0, 0, 0, 0);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [existingTargets, setExistingTargets] = useState<StudyTarget[]>([]);

    useEffect(() => {
        if (route.params?.selectedDate) {
            const date = new Date(route.params.selectedDate);
            date.setHours(0, 0, 0, 0);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            setSelectedDate(`${year}-${month}-${day}`);
        }

        loadSubjects();
        loadExistingTargets();
    }, [route.params?.selectedDate, profile?.grade]);

    useEffect(() => {
        if (selectedSubject) {
            loadTopics();
        }
    }, [selectedSubject]);

    const loadSubjects = () => {
        if (!profile?.grade) return;
        setSubjects(GRADE_SUBJECTS[profile.grade as GradeLevel] || []);
    };

    const loadTopics = () => {
        const subjectData = subjects.find(s => s.subject === selectedSubject);
        if (subjectData) {
            setTopics(subjectData.topics);
        } else {
            setTopics([]);
        }
    };

    const loadExistingTargets = async () => {
        try {
            const storageKey = `${profile?.name}_study_targets`;
            const targets = await AsyncStorage.getItem(storageKey);
            if (targets) {
                const allTargets = JSON.parse(targets);
                const dateTargets = allTargets.filter((target: StudyTarget) => target.date === selectedDate);
                setExistingTargets(dateTargets);
            } else {
                setExistingTargets([]);
            }
        } catch (error) {
            console.error('Error loading existing targets:', error);
            setExistingTargets([]);
        }
    };

    const handleAddTarget = async () => {
        try {
            // Check if the selected date is in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const targetDate = new Date(selectedDate);
            targetDate.setHours(0, 0, 0, 0);

            if (targetDate.getTime() < today.getTime()) {
                Alert.alert('Uyarı', 'Geçmiş tarihlere hedef eklenemez.');
                return;
            }

            if (!selectedSubject || !selectedTopic || !targetCount) {
                Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
                return;
            }

            const count = parseInt(targetCount, 10);
            if (isNaN(count) || count <= 0) {
                Alert.alert('Hata', 'Lütfen geçerli bir soru sayısı girin');
                return;
            }

            // Check if target already exists
            const targetExists = existingTargets.some(
                target =>
                    target.subject === selectedSubject &&
                    target.topic === selectedTopic
            );

            if (targetExists) {
                Alert.alert('Uyarı', 'Bu ders ve konu için zaten bir hedef belirlenmiş.');
                return;
            }

            const newTarget: StudyTarget = {
                subject: selectedSubject,
                topic: selectedTopic,
                targetCount: count,
                date: selectedDate,
                completed: false
            };

            const storageKey = `${profile?.name}_study_targets`;
            const existingTargetsData = await AsyncStorage.getItem(storageKey);
            const targets = existingTargetsData ? JSON.parse(existingTargetsData) : [];
            targets.push(newTarget);
            await AsyncStorage.setItem(storageKey, JSON.stringify(targets));

            // Reset form and reload targets
            setSelectedSubject('');
            setSelectedTopic('');
            setTargetCount('');
            loadExistingTargets();
        } catch (error) {
            console.error('Error adding target:', error);
            Alert.alert('Hata', 'Hedef eklenirken bir hata oluştu');
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

    const isToday = (date: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj.getTime() === today.getTime();
    };

    const isPastDate = (date: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj.getTime() < today.getTime();
    };

    useEffect(() => {
        if (isPastDate(selectedDate)) {
            navigation.setOptions({
                title: "Geçmiş Tarih"
            });
        }
    }, [selectedDate]);

    const renderSubjectItem = ({ item }: { item: Subject }) => (
        <TouchableOpacity
            style={[
                styles.modalItem,
                selectedSubject === item.subject && styles.modalItemSelected
            ]}
            onPress={() => {
                setSelectedSubject(item.subject);
                setSelectedTopic('');
                setShowSubjectModal(false);
            }}
        >
            <Text
                style={[
                    styles.modalItemText,
                    selectedSubject === item.subject && styles.modalItemTextSelected
                ]}
            >
                {item.subject}
            </Text>
            {selectedSubject === item.subject && (
                <Ionicons name="checkmark" size={20} color={COLORS.white} />
            )}
        </TouchableOpacity>
    );

    const renderTopicItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[
                styles.modalItem,
                selectedTopic === item && styles.modalItemSelected
            ]}
            onPress={() => {
                setSelectedTopic(item);
                setShowTopicModal(false);
            }}
        >
            <Text
                style={[
                    styles.modalItemText,
                    selectedTopic === item && styles.modalItemTextSelected
                ]}
            >
                {item}
            </Text>
            {selectedTopic === item && (
                <Ionicons name="checkmark" size={20} color={COLORS.white} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <HeaderBar
                title={isPastDate(selectedDate) ? "Geçmiş Tarih" : "Çalışma Hedefi Ekle"}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Card style={styles.dateCard}>
                    <View style={styles.dateHeader}>
                        <Ionicons name="calendar" size={22} color={COLORS.primary} />
                        <Text style={styles.dateTitle}>Hedef Tarihi</Text>
                    </View>
                    <Text style={[
                        styles.selectedDate,
                        isPastDate(selectedDate) && styles.pastDate
                    ]}>
                        {formatDate(selectedDate)}
                    </Text>
                </Card>

                {isPastDate(selectedDate) ? (
                    <Card style={styles.warningCard}>
                        <View style={styles.warningContent}>
                            <Ionicons name="alert-circle" size={32} color={COLORS.warning} />
                            <Text style={styles.warningTitle}>Geçmiş Tarih</Text>
                            <Text style={styles.warningText}>
                                Geçmiş tarihlere hedef eklenemez. Lütfen bugün veya gelecek bir tarih seçin.
                            </Text>
                        </View>
                    </Card>
                ) : (
                    <>
                        <Card style={styles.formCard}>
                            <View style={styles.formHeader}>
                                <Ionicons name="book" size={22} color={COLORS.primary} />
                                <Text style={styles.formTitle}>Ders ve Konu Seçimi</Text>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Ders</Text>
                                <TouchableOpacity
                                    style={styles.selectionButton}
                                    onPress={() => setShowSubjectModal(true)}
                                >
                                    <Text style={selectedSubject ? styles.selectionTextActive : styles.selectionText}>
                                        {selectedSubject || 'Ders Seçin'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Konu</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.selectionButton,
                                        !selectedSubject && styles.disabledButton
                                    ]}
                                    onPress={() => selectedSubject && setShowTopicModal(true)}
                                    disabled={!selectedSubject}
                                >
                                    <Text
                                        style={[
                                            selectedTopic ? styles.selectionTextActive : styles.selectionText,
                                            !selectedSubject && styles.disabledText
                                        ]}
                                    >
                                        {selectedTopic || 'Konu Seçin'}
                                    </Text>
                                    <Ionicons
                                        name="chevron-down"
                                        size={20}
                                        color={selectedSubject ? COLORS.primary : COLORS.border}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Hedef Soru Sayısı</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Örn: 25"
                                    keyboardType="number-pad"
                                    value={targetCount}
                                    onChangeText={setTargetCount}
                                />
                            </View>
                        </Card>

                        {existingTargets.length > 0 && (
                            <Card style={styles.existingTargetsCard}>
                                <View style={styles.existingHeader}>
                                    <Ionicons name="list" size={22} color={COLORS.primary} />
                                    <Text style={styles.existingTitle}>Mevcut Hedefler</Text>
                                </View>

                                {existingTargets.map((target, index) => (
                                    <View key={index} style={styles.existingItem}>
                                        <View style={styles.existingItemLeft}>
                                            <Text style={styles.existingSubject}>{target.subject}</Text>
                                            <Text style={styles.existingTopic}>{target.topic}</Text>
                                        </View>
                                        <View style={styles.existingItemRight}>
                                            <View style={styles.questionCount}>
                                                <Text style={styles.questionCountText}>{target.targetCount}</Text>
                                                <Text style={styles.questionLabel}>Soru</Text>
                                            </View>
                                            {target.completed && (
                                                <View style={styles.completedBadge}>
                                                    <Ionicons name="checkmark" size={12} color={COLORS.white} />
                                                    <Text style={styles.completedText}>Tamamlandı</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </Card>
                        )}

                        <Button
                            title="Hedefi Ekle"
                            onPress={handleAddTarget}
                            disabled={!selectedSubject || !selectedTopic || !targetCount}
                            style={styles.addButton}
                            size="large"
                            icon={<Ionicons name="add-circle" size={20} color={COLORS.white} style={{ marginRight: 8 }} />}
                        />
                    </>
                )}
            </ScrollView>

            {/* Subject Selection Modal */}
            <Modal
                visible={showSubjectModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowSubjectModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Ders Seçin</Text>
                            <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={subjects}
                            renderItem={renderSubjectItem}
                            keyExtractor={(item) => item.subject}
                            contentContainerStyle={styles.modalList}
                            showsVerticalScrollIndicator={false}
                        />
                    </Card>
                </View>
            </Modal>

            {/* Topic Selection Modal */}
            <Modal
                visible={showTopicModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowTopicModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedSubject} - Konu Seçin</Text>
                            <TouchableOpacity onPress={() => setShowTopicModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={topics}
                            renderItem={renderTopicItem}
                            keyExtractor={(item) => item}
                            contentContainerStyle={styles.modalList}
                            showsVerticalScrollIndicator={false}
                        />
                    </Card>
                </View>
            </Modal>

            <BottomTabBar activeScreen="StudyPlan" onTabPress={(screen) => navigation.navigate(screen as never)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: SIZES.padding,
        paddingBottom: 100, // Extra space for bottom tab bar
    },
    dateCard: {
        marginBottom: 16,
        padding: SIZES.padding,
    },
    dateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateTitle: {
        ...FONTS.h4,
        color: COLORS.text,
        marginLeft: 8,
    },
    selectedDate: {
        ...FONTS.h3,
        color: COLORS.primary,
    },
    formCard: {
        marginBottom: 16,
        padding: SIZES.padding,
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    formTitle: {
        ...FONTS.h4,
        color: COLORS.text,
        marginLeft: 8,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    selectionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
    },
    disabledButton: {
        borderColor: COLORS.border,
        backgroundColor: COLORS.backgroundSecondary,
    },
    selectionText: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
    },
    selectionTextActive: {
        ...FONTS.body2,
        color: COLORS.text,
    },
    disabledText: {
        color: COLORS.border,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        paddingHorizontal: 16,
        paddingVertical: 12,
        ...FONTS.body2,
        backgroundColor: COLORS.white,
    },
    existingTargetsCard: {
        marginBottom: 16,
        padding: SIZES.padding,
    },
    existingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    existingTitle: {
        ...FONTS.h4,
        color: COLORS.text,
        marginLeft: 8,
    },
    existingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingVertical: 12,
    },
    existingItemLeft: {
        flex: 1,
    },
    existingSubject: {
        ...FONTS.h5,
        color: COLORS.text,
    },
    existingTopic: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
    },
    existingItemRight: {
        alignItems: 'flex-end',
    },
    questionCount: {
        alignItems: 'center',
    },
    questionCountText: {
        ...FONTS.h4,
        color: COLORS.primary,
    },
    questionLabel: {
        ...FONTS.small,
        color: COLORS.textSecondary,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 4,
    },
    completedText: {
        ...FONTS.small,
        color: COLORS.white,
        marginLeft: 4,
    },
    addButton: {
        marginVertical: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
    },
    modalContent: {
        width: '100%',
        maxHeight: '80%',
        padding: 0,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        ...FONTS.h4,
        color: COLORS.text,
    },
    modalList: {
        padding: 8,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalItemSelected: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        borderBottomWidth: 0,
    },
    modalItemText: {
        ...FONTS.body2,
        color: COLORS.text,
    },
    modalItemTextSelected: {
        color: COLORS.white,
    },
    warningCard: {
        marginVertical: 16,
        padding: SIZES.padding,
    },
    warningContent: {
        alignItems: 'center',
        padding: SIZES.padding,
    },
    warningTitle: {
        ...FONTS.h3,
        color: COLORS.warning,
        marginTop: 12,
        marginBottom: 8,
    },
    warningText: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    pastDate: {
        color: COLORS.textSecondary,
    },
}); 