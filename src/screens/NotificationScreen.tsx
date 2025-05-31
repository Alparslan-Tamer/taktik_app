import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, Platform, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { useProfile } from '../context/ProfileContext';
import { useNavigation } from '@react-navigation/native';

interface NotificationSettings {
    dailyReminders: boolean;
    weeklyReports: boolean;
    achievementAlerts: boolean;
    studyTimeReminders: boolean;
}

const defaultSettings: NotificationSettings = {
    dailyReminders: true,
    weeklyReports: true,
    achievementAlerts: true,
    studyTimeReminders: true,
};

export const NotificationScreen = () => {
    const navigation = useNavigation();
    const { profile } = useProfile();
    const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem('notification_settings');
            const parsed = saved ? JSON.parse(saved) : defaultSettings;
            setSettings(parsed);
        } catch (error) {
            console.error('Error loading notification settings:', error);
        }
    };

    const saveSettings = async (newSettings: NotificationSettings) => {
        try {
            await AsyncStorage.setItem('notification_settings', JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    };

    const toggleSetting = async (key: keyof NotificationSettings) => {
        const newSettings = {
            ...settings,
            [key]: !settings[key],
        };
        
        // Önce ayarları kaydet
        await saveSettings(newSettings);
        
        // Bildirim ayarlarını güncelle
        if (key === 'dailyReminders' && !newSettings.dailyReminders) {
            // Bildirimleri sadece kapatıldığında iptal et
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <LinearGradient
                colors={[COLORS.primary, COLORS.darkPurple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Bildirimler</Text>
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Günlük Hatırlatmalar</Text>
                    <Switch
                        value={settings.dailyReminders}
                        onValueChange={() => toggleSetting('dailyReminders')}
                        trackColor={{ false: '#767577', true: COLORS.primary }}
                        thumbColor={settings.dailyReminders ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#767577"
                    />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Haftalık Çalışma Raporu</Text>
                    <Switch
                        value={settings.weeklyReports}
                        onValueChange={() => toggleSetting('weeklyReports')}
                        trackColor={{ false: '#767577', true: COLORS.primary }}
                        thumbColor={settings.weeklyReports ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#767577"
                    />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Başarı Bildirimleri</Text>
                    <Switch
                        value={settings.achievementAlerts}
                        onValueChange={() => toggleSetting('achievementAlerts')}
                        trackColor={{ false: '#767577', true: COLORS.primary }}
                        thumbColor={settings.achievementAlerts ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#767577"
                    />
                </View>

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Çalışma Zamanı Hatırlatmaları</Text>
                    <Switch
                        value={settings.studyTimeReminders}
                        onValueChange={() => toggleSetting('studyTimeReminders')}
                        trackColor={{ false: '#767577', true: COLORS.primary }}
                        thumbColor={settings.studyTimeReminders ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#767577"
                    />
                </View>
            </View>

            {/* Geri Butonu */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Ayarlara Dön</Text>
            </TouchableOpacity>
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
        textAlign: 'center',
    },
    content: {
        flex: 1,
        marginTop: -30,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    backButton: {
        margin: SIZES.padding,
        padding: SIZES.padding,
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        alignItems: 'center',
    },
    backButtonText: {
        ...FONTS.h4,
        color: COLORS.white,
        fontWeight: '600',
    },
});