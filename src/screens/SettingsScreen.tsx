import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    Alert,
    Platform,
    ActivityIndicator,
    Linking,
    Share
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useProfile } from '../context/ProfileContext';
import { HeaderBar } from '../components/HeaderBar';
import { Card } from '../components/Card';
import { BottomTabBar } from '../components/BottomTabBar';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { UserProfile } from '../types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Export BottomTabScreen so it can be used in other files
export type BottomTabScreen = 'Main' | 'StudyLog' | 'Settings' | 'StudyPlan';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const SettingsScreen = () => {
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const { profile, loading } = useProfile();
    const [profilePhoto, setProfilePhoto] = useState<string | undefined>();

    useEffect(() => {
        if (profile) {
            setProfilePhoto(profile.photoUri || profile.photo);
        }
    }, [profile]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove(['educationLevel', 'gradeLevel']);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
            });
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
        }
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    // Bildirimler ekranına git
    const handleNotifications = () => {
        navigation.navigate('Notification');
    };

    const handleTabPress = (screen: BottomTabScreen) => {
        if (screen === 'Settings') return;
        if (screen === 'StudyPlan') {
            navigation.navigate('StudyPlan', { selectedDate: new Date().toISOString() });
        } else {
            navigation.navigate(screen);
        }
    };

    const renderSettingItem = (
        icon: string,
        title: string,
        onPress: () => void,
        showBorder = true,
    ) => (
        <TouchableOpacity
            style={[styles.settingItem, showBorder && styles.settingItemBorder]}
            onPress={onPress}
        >
            <View style={styles.settingItemContent}>
                <View style={styles.settingIcon}>
                    <Ionicons name={icon as any} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.settingItemText}>{title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <LinearGradient
                colors={[COLORS.primary, COLORS.darkPurple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Ayarlar</Text>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Card style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        {profilePhoto ? (
                            <Image
                                source={{ uri: profilePhoto }}
                                style={styles.profilePhoto}
                                onError={() => setProfilePhoto(undefined)}
                            />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Ionicons name="person" size={40} color={COLORS.primary} />
                            </View>
                        )}
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{profile?.name}</Text>
                            <Text style={styles.profileGrade}>{profile?.grade}. Sınıf</Text>
                        </View>
                    </View>
                </Card>

                <View style={styles.settingsGroup}>
                    <Text style={styles.groupTitle}>Hesap</Text>
                    {renderSettingItem('person-outline', 'Profili Düzenle', handleEditProfile)}
                    {renderSettingItem('notifications-outline', 'Bildirimler', handleNotifications)}
                    {renderSettingItem('lock-closed-outline', 'Gizlilik', () => navigation.navigate('Privacy'), false)}
                </View>

                <View style={styles.settingsGroup}>
                    <Text style={styles.groupTitle}>Uygulama</Text>
                    {renderSettingItem('information-circle-outline', 'Hakkında', () => navigation.navigate('About'))}
                    {renderSettingItem('star-outline', 'Uygulamayı Değerlendir', () => {
                        Linking.openURL('https://apps.apple.com/app/your-app-id');
                    })}
                    {renderSettingItem('share-outline', 'Arkadaşlarına Öner', () => {
                        Share.share({
                            message: 'Taktik uygulamasını deneyin! Çalışmalarınızı planlayın ve hedeflerinize ulaşın.',
                            url: 'https://apps.apple.com/app/your-app-id',
                        });
                    }, false)}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomTabBar
                activeScreen="Settings"
                onTabPress={handleTabPress}
            />
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
    },
    scrollContent: {
        paddingBottom: 100,
    },
    profileCard: {
        marginBottom: SIZES.padding,
        padding: SIZES.padding,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.backgroundSecondary,
    },
    photoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        marginLeft: SIZES.padding,
        flex: 1,
    },
    profileName: {
        ...FONTS.h3,
        color: COLORS.text,
    },
    profileGrade: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    settingsGroup: {
        backgroundColor: COLORS.white,
        marginHorizontal: SIZES.padding,
        marginBottom: SIZES.padding,
        borderRadius: SIZES.radius,
        ...SHADOWS.medium,
    },
    groupTitle: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        padding: SIZES.padding,
        paddingBottom: SIZES.base,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
    },
    settingItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    settingItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.base,
    },
    settingItemText: {
        ...FONTS.body1,
        color: COLORS.text,
        marginLeft: SIZES.base,
    },
    logoutButton: {
        margin: SIZES.padding,
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    logoutText: {
        ...FONTS.h4,
        color: COLORS.danger,
    },
}); 