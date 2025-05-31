import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type DailyTriggerInput = {
    type: 'daily';
    hour: number;
    minute: number;
    repeats: boolean;
};

type WeeklyTriggerInput = {
    type: 'weekly';
    weekday: number;
    hour: number;
    minute: number;
    repeats: boolean;
};

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
export async function scheduleDailyReminder(hour: number, minute: number) {
    await Notifications.cancelScheduledNotificationAsync('daily-reminder');

    return await Notifications.scheduleNotificationAsync({
        identifier: 'daily-reminder',
        content: {
            title: "Günlük Çalışma Hatırlatması",
            body: "Bugünkü hedeflerinizi kontrol etmeyi unutmayın!",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour,
            minute,
            repeats: true,
        },
    });
}

export async function requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return false;
    }

    return true;
}

export async function scheduleWeeklyReport() {
    await Notifications.cancelScheduledNotificationAsync('weekly-report');

    return await Notifications.scheduleNotificationAsync({
        identifier: 'weekly-report',
        content: {
            title: "Haftalık Çalışma Raporunuz",
            body: "Bu haftaki ilerlemenizi görmek için tıklayın.",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            weekday: 7, // Pazar günü
            hour: 20,
            minute: 0,
            repeats: true,
        },
    });
}

export async function scheduleStudyTimeReminder(hour: number, minute: number) {
    await Notifications.cancelScheduledNotificationAsync('study-time-reminder');

    return await Notifications.scheduleNotificationAsync({
        identifier: 'study-time-reminder',
        content: {
            title: "Çalışma Zamanı",
            body: "Planlı çalışma saatiniz geldi! Hadi başlayalım.",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour,
            minute,
            repeats: true,
        },
    });
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function setupNotificationHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

export function configurePushNotifications() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
}
