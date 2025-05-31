import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { Card } from '../components/Card';

export const PrivacyScreen = () => {
    const navigation = useNavigation();

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
                    <Text style={styles.headerTitle}>Gizlilik</Text>
                    <View style={{ width: 24 }} />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Veri Kullanımı</Text>
                    <Text style={styles.sectionText}>
                        Taktik uygulaması, yalnızca çalışma hedeflerinizi ve ilerlemenizi takip etmek için gerekli olan kişisel bilgileri toplar. Bu bilgiler:
                    </Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPoint}>• İsim ve sınıf bilgisi</Text>
                        <Text style={styles.bulletPoint}>• Profil fotoğrafı (isteğe bağlı)</Text>
                        <Text style={styles.bulletPoint}>• Çalışma hedefleri ve istatistikleri</Text>
                    </View>
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Veri Depolama</Text>
                    <Text style={styles.sectionText}>
                        Tüm verileriniz yalnızca cihazınızda yerel olarak saklanır. Verileriniz herhangi bir sunucuya gönderilmez veya üçüncü taraflarla paylaşılmaz.
                    </Text>
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Verileriniz Üzerinde Kontrol</Text>
                    <Text style={styles.sectionText}>
                        Dilediğiniz zaman profilinizi silebilir ve tüm verilerinizi temizleyebilirsiniz. Profil silme işlemi geri alınamaz ve tüm çalışma verileriniz kalıcı olarak silinir.
                    </Text>
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>İzinler</Text>
                    <Text style={styles.sectionText}>
                        Uygulama aşağıdaki izinleri isteyebilir:
                    </Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPoint}>• Fotoğraf galerisi (profil fotoğrafı için)</Text>
                        <Text style={styles.bulletPoint}>• Bildirimler (hatırlatıcılar için)</Text>
                    </View>
                    <Text style={styles.sectionText}>
                        Bu izinleri cihaz ayarlarından istediğiniz zaman değiştirebilirsiniz.
                    </Text>
                </Card>
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
        paddingBottom: SIZES.padding * 2,
    },
    section: {
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
    },
    sectionTitle: {
        ...FONTS.h4,
        color: COLORS.text,
        marginBottom: SIZES.base,
    },
    sectionText: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        marginBottom: SIZES.padding,
    },
    bulletPoints: {
        marginTop: SIZES.base,
        marginBottom: SIZES.padding,
    },
    bulletPoint: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        marginBottom: SIZES.base,
    },
}); 