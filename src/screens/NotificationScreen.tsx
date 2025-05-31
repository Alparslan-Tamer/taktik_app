import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Switch, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import {
    requestNotificationPermissions,
    scheduleDailyReminder,
    scheduleWeeklyReport,
    scheduleStudyTimeReminder,
    cancelAllNotifications,
    setupNotificationHandler
} from '../utils/notifications';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { Card } from '../components/Card';

interface NotificationSettings {
    notificationsEnabled: boolean;
}

const defaultSettings: NotificationSettings = {
    notificationsEnabled: true,
};

export default function NotificationScreen() {
    const navigation = useNavigation();
    const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        setupNotificationHandler();
        loadSettings();
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        const permission = await requestNotificationPermissions();
        setHasPermission(permission);
    };

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('notificationSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Error loading notification settings:', error);
        }
    };

    const saveSettings = async (newSettings: NotificationSettings) => {
        try {
            await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
            setSettings(newSettings);
            await updateNotifications(newSettings);
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    };

    const updateNotifications = async (newSettings: NotificationSettings) => {
        await cancelAllNotifications();

        if (!hasPermission || !newSettings.notificationsEnabled) return;

        // Schedule all notifications with default times
        await scheduleDailyReminder(9, 0); // 09:00
        await scheduleWeeklyReport(); // Pazar 20:00
        await scheduleStudyTimeReminder(14, 0); // 14:00
    };

    const toggleNotifications = async (value: boolean) => {
        if (value && !hasPermission) {
            const permission = await requestNotificationPermissions();
            if (!permission) {
                return;
            }
            setHasPermission(true);
        }

        const newSettings = {
            ...settings,
            notificationsEnabled: value,
        };
        saveSettings(newSettings);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[COLORS.primary, COLORS.darkPurple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bildirimler</Text>
                    <View style={{ width: 24 }} />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Card style={styles.mainCard}>
                    <View style={styles.settingHeader}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Bildirimleri Etkinleştir</Text>
                            <Text style={styles.settingDescription}>
                                Çalışma hatırlatmaları ve haftalık raporlar için bildirimleri yönetin
                            </Text>
                        </View>
                        <Switch
                            value={settings.notificationsEnabled}
                            onValueChange={toggleNotifications}
                            trackColor={{ false: COLORS.border, true: COLORS.primary }}
                            thumbColor={settings.notificationsEnabled ? COLORS.white : '#f4f3f4'}
                            ios_backgroundColor={COLORS.border}
                        />
                    </View>
                </Card>

                <Card style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Bildirim Türleri</Text>
                    <View style={styles.infoItem}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoItemTitle}>Günlük Hatırlatıcı</Text>
                            <Text style={styles.infoItemDescription}>Her sabah 09:00'da çalışma hedeflerinizi hatırlatır</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={24} color={COLORS.primary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoItemTitle}>Çalışma Zamanı</Text>
                            <Text style={styles.infoItemDescription}>Her gün 14:00'te çalışmaya başlamanız için hatırlatma yapar</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="stats-chart" size={24} color={COLORS.primary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoItemTitle}>Haftalık Rapor</Text>
                            <Text style={styles.infoItemDescription}>Her Pazar 20:00'de haftalık çalışma istatistiklerinizi gösterir</Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SIZES.padding,
        paddingTop: SIZES.padding * 2,
        paddingBottom: SIZES.padding * 2.5,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
        ...FONTS.h2,
        color: COLORS.white,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        marginTop: -30,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    scrollContent: {
        padding: SIZES.padding,
    },
    mainCard: {
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
    },
    settingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingInfo: {
        flex: 1,
        marginRight: SIZES.padding,
    },
    settingTitle: {
        ...FONTS.h4,
        color: COLORS.text,
        marginBottom: 4,
    },
    settingDescription: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
    },
    infoCard: {
        padding: SIZES.padding,
    },
    infoTitle: {
        ...FONTS.h4,
        color: COLORS.text,
        marginBottom: SIZES.padding,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    infoContent: {
        flex: 1,
        marginLeft: SIZES.padding,
    },
    infoItemTitle: {
        ...FONTS.body2,
        color: COLORS.text,
        marginBottom: 2,
    },
    infoItemDescription: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
    },
});