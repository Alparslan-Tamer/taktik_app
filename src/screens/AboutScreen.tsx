import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
    Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { Card } from '../components/Card';

const APP_VERSION = '1.0.0';

export const AboutScreen = () => {
    const navigation = useNavigation();

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@taktikapp.com');
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
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Hakkında</Text>
                    <View style={{ width: 24 }} />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                        <Ionicons name="book" size={60} color={COLORS.primary} />
                    </View>
                    <Text style={styles.appName}>Taktik</Text>
                    <Text style={styles.version}>Versiyon {APP_VERSION}</Text>
                </View>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Uygulama Hakkında</Text>
                    <Text style={styles.text}>
                        Taktik, öğrencilerin çalışma hedeflerini belirlemelerine ve takip etmelerine
                        yardımcı olan bir uygulamadır. Düzenli çalışma alışkanlığı kazandırmayı ve
                        akademik başarıyı artırmayı hedefler.
                    </Text>
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Özellikler</Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPoint}>• Günlük çalışma hedefleri oluşturma</Text>
                        <Text style={styles.bulletPoint}>• Çalışma süresi takibi</Text>
                        <Text style={styles.bulletPoint}>• İlerleme analizi</Text>
                        <Text style={styles.bulletPoint}>• Hatırlatma bildirimleri</Text>
                        <Text style={styles.bulletPoint}>• Çoklu profil desteği</Text>
                    </View>
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>İletişim</Text>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={handleContactSupport}
                    >
                        <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
                        <Text style={styles.contactButtonText}>Destek Ekibine Ulaşın</Text>
                    </TouchableOpacity>
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Teşekkürler</Text>
                    <Text style={styles.text}>
                        Bu uygulamayı geliştirmemize yardımcı olan tüm öğretmenlerimize,
                        öğrencilerimize ve test kullanıcılarımıza teşekkür ederiz.
                    </Text>
                </Card>

                <Text style={styles.copyright}>
                    © 2024 Taktik. Tüm hakları saklıdır.
                </Text>
            </ScrollView>
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
        paddingBottom: SIZES.padding * 2,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
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
        marginTop: -20,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SIZES.padding,
        paddingBottom: SIZES.padding * 2,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: SIZES.padding * 2,
    },
    logoBackground: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        ...FONTS.h1,
        color: COLORS.text,
        marginBottom: SIZES.base,
    },
    version: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
    },
    section: {
        marginBottom: SIZES.padding,
        padding: SIZES.padding,
    },
    sectionTitle: {
        ...FONTS.h3,
        color: COLORS.text,
        marginBottom: SIZES.base,
    },
    text: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        marginBottom: SIZES.base,
    },
    bulletPoints: {
        marginTop: SIZES.base,
    },
    bulletPoint: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        marginBottom: SIZES.base / 2,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.backgroundSecondary,
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        marginTop: SIZES.base,
    },
    contactButtonText: {
        ...FONTS.h4,
        color: COLORS.primary,
        marginLeft: SIZES.base,
    },
    copyright: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SIZES.padding,
    },
}); 