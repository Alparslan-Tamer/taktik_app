import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../context/ProfileContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradeLevel, UserProfile } from '../types';

export const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { profile, setProfile } = useProfile();
    const [photoUri, setPhotoUri] = useState<string | undefined>(profile?.photoUri);
    const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(profile?.grade as GradeLevel);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Hata', 'Fotoğraf seçebilmek için izin gerekiyor.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        try {
            if (!profile) return;

            const updatedProfile: UserProfile = {
                ...profile,
                photoUri: photoUri,
                grade: selectedGrade,
            };

            // Update profiles array
            const profilesJson = await AsyncStorage.getItem('profiles');
            const profiles = profilesJson ? JSON.parse(profilesJson) : [];
            const updatedProfiles = profiles.map((p: UserProfile) =>
                p.name === profile.name ? updatedProfile : p
            );

            await AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
            await AsyncStorage.setItem('activeProfile', JSON.stringify(updatedProfile));
            setProfile(updatedProfile);

            navigation.goBack();
            Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
        }
    };

    // 5'ten 12'ye kadar olan sınıfları oluştur (8 sınıf)
    const grades: GradeLevel[] = [5, 6, 7, 8, 9, 10, 11, 12];

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <LinearGradient
                colors={['#6C63FF', '#4F44FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Profili Düzenle</Text>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profil Fotoğrafı</Text>
                    <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                        {photoUri ? (
                            <Image source={{ uri: photoUri }} style={styles.photo} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Ionicons name="camera" size={40} color={COLORS.textSecondary} />
                                <Text style={styles.photoText}>Fotoğraf eklemek için dokunun</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sınıf</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.gradeContainer}
                        decelerationRate="fast"
                        snapToInterval={120 + SIZES.base * 2}
                        snapToAlignment="center"
                    >
                        {grades.map((grade) => (
                            <TouchableOpacity
                                key={grade}
                                style={[
                                    styles.gradeButton,
                                    selectedGrade === grade && styles.gradeButtonSelected,
                                ]}
                                onPress={() => setSelectedGrade(grade)}
                            >
                                <Text
                                    style={[
                                        styles.gradeText,
                                        selectedGrade === grade && styles.gradeTextSelected,
                                    ]}
                                >
                                    {grade}.Sınıf
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.footerButton, styles.cancelButton]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.footerButton, styles.saveButton]}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Kaydet</Text>
                </TouchableOpacity>
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
        paddingTop: SIZES.padding,
        paddingBottom: SIZES.padding * 2,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
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
        paddingBottom: SIZES.padding * 2,
    },
    section: {
        marginBottom: SIZES.padding * 2,
    },
    sectionTitle: {
        ...FONTS.h3,
        color: COLORS.text,
        marginBottom: SIZES.padding,
    },
    photoContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        ...SHADOWS.medium,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundSecondary,
    },
    photoText: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        marginTop: SIZES.base,
        textAlign: 'center',
        paddingHorizontal: SIZES.padding,
    },
    gradeContainer: {
        marginHorizontal: -SIZES.padding,
        paddingHorizontal: SIZES.padding,
    },
    gradeButton: {
        width: 100,
        height: 100,
        margin: SIZES.base,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    gradeButtonSelected: {
        backgroundColor: COLORS.primary,
        transform: [{ scale: 1.05 }],
    },
    gradeText: {
        ...FONTS.body1,
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
    },
    gradeTextSelected: {
        color: COLORS.white,
    },
    footer: {
        backgroundColor: COLORS.white,
        padding: SIZES.padding,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        gap: SIZES.padding,
    },
    footerButton: {
        flex: 1,
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    cancelButton: {
        backgroundColor: COLORS.backgroundSecondary,
    },
    cancelButtonText: {
        ...FONTS.h4,
        color: COLORS.text,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    saveButtonText: {
        ...FONTS.h4,
        color: COLORS.white,
    },
}); 