import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Initialize notification channel and permissions
 */
export async function initNotificationChannel() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
    }
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminders', {
            name: 'Günlük Hatırlatmalar',
            importance: Notifications.AndroidImportance.HIGH,
        });
    }
}

/**
 * Determine today's notification body based on stored targets
 */
export async function getDailyBody(username: string): Promise<string> {
    try {
        const raw = await AsyncStorage.getItem(`${username}_study_targets`);
        const targets = raw ? JSON.parse(raw) : [];
        const today = new Date().toISOString().slice(0, 10);
        return (targets as any[]).filter((t) => t.date === today).length > 0
            ? 'Hedeflerin seni bekliyor!'
            : 'Bugün henüz hedef belirlemedin!';
    } catch {
        return 'Bugün henüz hedef belirlemedin!';
    }
}

/**
 * Schedule or reschedule the repeating daily reminder at 09:00
 */
export async function scheduleDailyReminder(username: string) {
    // Cancel existing reminders
    await Notifications.cancelAllScheduledNotificationsAsync();
    await initNotificationChannel();
    const body = await getDailyBody(username);
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Günlük Hedef Hatırlatması',
            body,
            sound: true,
            ...(Platform.OS === 'android' && { channelId: 'daily-reminders' }),
        },
        // Calendar trigger at 09:00 daily
        trigger: { hour: 9, minute: 0, repeats: true } as any,
    });
}
