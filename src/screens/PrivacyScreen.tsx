import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
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
                    <Text style={styles.text}>
                        Taktik uygulaması, size en iyi deneyimi sunmak için bazı kişisel verilerinizi toplar ve kullanır.
                        Bu veriler şunları içerir:
                    </Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPoint}>• İsim ve sınıf bilgileriniz</Text>
                        <Text style={styles.bulletPoint}>• Çalışma hedefleriniz ve ilerlemeniz</Text>
                        <Text style={styles.bulletPoint}>• Profil fotoğrafınız (isteğe bağlı)</Text>
                    </View>
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Veri Saklama</Text>
                    <Text style={styles.text}>
                        Tüm verileriniz yalnızca cihazınızda yerel olarak saklanır. Verileriniz:
                    </Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPoint}>• Herhangi bir sunucuya gönderilmez</Text>
                        <Text style={styles.bulletPoint}>• Üçüncü taraflarla paylaşılmaz</Text>
                        <Text style={styles.bulletPoint}>• Yalnızca uygulama içi deneyiminizi iyileştirmek için kullanılır</Text>
                    </View>
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Verilerinizin Kontrolü</Text>
                    <Text style={styles.text}>
                        Verileriniz üzerinde tam kontrole sahipsiniz:
                    </Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPoint}>• İstediğiniz zaman profilinizi silebilirsiniz</Text>
                        <Text style={styles.bulletPoint}>• Tüm çalışma verilerinizi temizleyebilirsiniz</Text>
                        <Text style={styles.bulletPoint}>• Profil fotoğrafınızı değiştirebilir veya kaldırabilirsiniz</Text>
                    </View>
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>İzinler</Text>
                    <Text style={styles.text}>
                        Uygulama aşağıdaki izinleri kullanabilir:
                    </Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPoint}>• Fotoğraf galerisi (profil fotoğrafı için)</Text>
                        <Text style={styles.bulletPoint}>• Bildirimler (çalışma hatırlatmaları için)</Text>
                    </View>
                    <Text style={styles.text}>
                        Bu izinleri istediğiniz zaman cihaz ayarlarınızdan değiştirebilirsiniz.
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
        marginLeft: SIZES.base,
    },
    bulletPoint: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        marginBottom: SIZES.base / 2,
    },
}); 