import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../context/ProfileContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext';
import { GradeLevel, UserProfile } from '../types';

const { width } = Dimensions.get('window');

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const OnboardingScreen = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [name, setName] = useState('');
    const [photoUri, setPhotoUri] = useState<string | undefined>();
    const [grade, setGrade] = useState<GradeLevel>(5);
    const [error, setError] = useState('');
    const [profiles, setProfiles] = useState<UserProfile[]>([]);

    const navigation = useNavigation<OnboardingScreenNavigationProp>();
    const { profile, setProfile } = useProfile();
    const { setUserInfo } = useUser();

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        try {
            const profilesJson = await AsyncStorage.getItem('profiles');
            if (profilesJson) {
                setProfiles(JSON.parse(profilesJson));
            }
        } catch (error) {
            console.error('Error loading profiles:', error);
        }
    };

    const handleContinueWithProfile = async (selectedProfile: UserProfile) => {
        try {
            if (!selectedProfile.grade) {
                Alert.alert('Hata', 'Profil bilgileri eksik');
                return;
            }

            await setUserInfo('high', selectedProfile.grade);
            await AsyncStorage.setItem('activeProfile', JSON.stringify(selectedProfile));
            setProfile(selectedProfile);

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                })
            );
        } catch (error) {
            console.error('Error continuing with profile:', error);
            Alert.alert('Hata', 'Profil yüklenirken bir hata oluştu');
        }
    };

    const handleStartNewProfile = async () => {
        try {
            // Clear previous profile data
            await AsyncStorage.multiRemove(['educationLevel', 'gradeLevel']);

            setShowOnboarding(true);
            setCurrentStep(1);
            setName('');
            setPhotoUri(undefined);
            setGrade(5);
            setError('');
        } catch (error) {
            console.error('Error clearing previous profile data:', error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu');
        }
    };

    const handleDeleteProfile = async (profileToDelete: UserProfile) => {
        Alert.alert(
            'Profili Sil',
            'Bu profil ve tüm verileri kalıcı olarak silinecektir. Devam etmek istiyor musunuz?',
            [
                {
                    text: 'İptal',
                    style: 'cancel',
                },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Remove profile from profiles array
                            const updatedProfiles = profiles.filter(p => p.name !== profileToDelete.name);
                            await AsyncStorage.setItem('profiles', JSON.stringify(updatedProfiles));
                            setProfiles(updatedProfiles);

                            // If this was the active profile, clear it
                            if (profile?.name === profileToDelete.name) {
                                setProfile(null);
                            }

                            // Remove profile-specific data
                            const keysToRemove = (await AsyncStorage.getAllKeys()).filter(key =>
                                key.includes(`${profileToDelete.name}_`)
                            );
                            await AsyncStorage.multiRemove(keysToRemove);

                            Alert.alert('Başarılı', 'Profil başarıyla silindi.');
                        } catch (error) {
                            console.error('Error deleting profile:', error);
                            Alert.alert('Hata', 'Profil silinirken bir hata oluştu. Lütfen tekrar deneyin.');
                        }
                    },
                },
            ],
        );
    };

    const handleNext = async () => {
        try {
            if (currentStep === 1) {
                if (!name.trim()) {
                    Alert.alert('Hata', 'Lütfen adınızı girin');
                    return;
                }

                // Check if a profile with the same name exists
                const existingProfiles = await AsyncStorage.getItem('profiles');
                const profiles = existingProfiles ? JSON.parse(existingProfiles) : [];

                const nameExists = profiles.some((profile: UserProfile) =>
                    profile.name.toLowerCase() === name.trim().toLowerCase()
                );

                if (nameExists) {
                    Alert.alert('Hata', 'Bu isimde bir profil zaten var. Lütfen farklı bir isim seçin.');
                    return;
                }

                setCurrentStep(2);
            } else if (currentStep === 2) {
                // Photo is optional, just proceed
                setCurrentStep(3);
            } else if (currentStep === 3) {
                if (!grade) {
                    Alert.alert('Hata', 'Lütfen sınıfınızı seçin');
                    return;
                }

                // Create and save the profile
                const newProfile: UserProfile = {
                    name: name.trim(),
                    photo: photoUri,
                    grade: grade,
                    createdAt: new Date().toISOString()
                };

                // Add new profile to profiles array
                const existingProfiles = await AsyncStorage.getItem('profiles');
                const profiles = existingProfiles ? JSON.parse(existingProfiles) : [];
                profiles.push(newProfile);
                await AsyncStorage.setItem('profiles', JSON.stringify(profiles));

                // Set as active profile and save settings
                await AsyncStorage.setItem('activeProfile', JSON.stringify(newProfile));
                await AsyncStorage.setItem('educationLevel', 'high');
                await AsyncStorage.setItem('gradeLevel', grade.toString());
                await setUserInfo('high', grade);
                setProfile(newProfile);

                // Navigate to main screen
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    })
                );
            }
        } catch (error) {
            console.error('Error in onboarding:', error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu');
        }
    };

    const handleEducationLevelNext = async () => {
        try {
            if (!grade) {
                Alert.alert('Hata', 'Lütfen sınıfınızı seçin');
                return;
            }

            if (!profile) return;

            // Update active profile with grade level
            const updatedProfile = {
                ...profile,
                grade
            };
            await AsyncStorage.setItem('activeProfile', JSON.stringify(updatedProfile));
            setProfile(updatedProfile);

            // Save grade level
            await AsyncStorage.setItem('gradeLevel', grade.toString());

            // Navigate to main screen
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                })
            );
        } catch (error) {
            console.error('Error saving grade level:', error);
            Alert.alert('Hata', 'Sınıf seviyesi kaydedilirken bir hata oluştu');
        }
    };

    if (!showOnboarding && profiles.length > 0) {
        return (
            <LinearGradient
                colors={[COLORS.primary, COLORS.darkPurple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.profileSelectionContentContainer}
                    style={styles.profileSelectionContainer}
                >
                    <Text style={styles.welcomeText}>Hoş Geldin!</Text>
                    <Text style={styles.subtitle}>Profilini seç veya yeni bir profil oluştur</Text>

                    {profiles.map((existingProfile, index) => (
                        <View key={index} style={styles.existingProfileCard}>
                            <View style={styles.profileInfo}>
                                {existingProfile.photo ? (
                                    <Image source={{ uri: existingProfile.photo }} style={styles.profilePhoto} />
                                ) : (
                                    <View style={styles.photoPlaceholder}>
                                        <Ionicons name="person" size={40} color={COLORS.primary} />
                                    </View>
                                )}
                                <View style={styles.profileText}>
                                    <Text style={styles.profileName}>{existingProfile.name}</Text>
                                    <Text style={styles.profileGrade}>{existingProfile.grade}. Sınıf</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteProfile(existingProfile)}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => handleContinueWithProfile(existingProfile)}
                            >
                                <Text style={styles.continueButtonText}>Bu Profille Devam Et</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.newProfileButton}
                        onPress={handleStartNewProfile}
                    >
                        <Text style={styles.newProfileButtonText}>Yeni Profil Oluştur</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        );
    }

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
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

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>İsminiz nedir?</Text>
                        <Text style={styles.subtitle}>Deneyiminizi kişiselleştirmek için kullanacağız</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="İsminizi girin"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor={COLORS.textSecondary}
                        />
                    </View>
                );
            case 2:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>Profil fotoğrafı ekleyin</Text>
                        <Text style={styles.subtitle}>Bu adım isteğe bağlıdır ancak profilinizi kişiselleştirmenize yardımcı olur</Text>
                        <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                            {photoUri ? (
                                <Image source={{ uri: photoUri }} style={styles.photo} />
                            ) : (
                                <View style={styles.onboardingPhotoPlaceholder}>
                                    <Ionicons name="camera" size={40} color={COLORS.textSecondary} />
                                    <Text style={styles.photoText}>Fotoğraf eklemek için dokunun</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                );
            case 3:
                const gradeOptions = Array.from({ length: 8 }, (_, i) => i + 5); // 5'ten 12'ye kadar
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>Sınıfınızı seçin</Text>
                        <Text style={styles.subtitle}>Size uygun içerikleri göstermemize yardımcı olur</Text>
                        <View style={styles.gradeContainer}>
                            {gradeOptions.map((gradeOption) => (
                                <TouchableOpacity
                                    key={gradeOption}
                                    style={[
                                        styles.gradeButton,
                                        grade === gradeOption && styles.gradeButtonSelected,
                                    ]}
                                    onPress={() => setGrade(gradeOption as GradeLevel)}
                                >
                                    <Text
                                        style={[
                                            styles.gradeText,
                                            grade === gradeOption && styles.gradeTextSelected,
                                        ]}
                                    >
                                        {gradeOption}. Sınıf
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <LinearGradient
            colors={[COLORS.primary, COLORS.darkPurple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.progressContainer}>
                    {[1, 2, 3].map((dot) => (
                        <View
                            key={dot}
                            style={[
                                styles.progressDot,
                                dot === currentStep && styles.progressDotActive,
                                dot < currentStep && styles.progressDotCompleted,
                            ]}
                        />
                    ))}
                </View>

                {renderStep()}

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.buttonContainer}>
                    {currentStep > 1 && (
                        <TouchableOpacity
                            style={[styles.button, styles.backButton]}
                            onPress={() => setCurrentStep(currentStep - 1)}
                        >
                            <Text style={[styles.buttonText, styles.backButtonText]}>Geri</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.button, styles.nextButton]}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>
                            {currentStep === 3 ? 'Başla' : 'İleri'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SIZES.padding,
        paddingTop: Platform.OS === 'ios' ? SIZES.padding * 2 : SIZES.padding,
        paddingBottom: SIZES.padding * 2,
        justifyContent: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SIZES.padding * 2,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.backgroundSecondary,
        marginHorizontal: SIZES.base / 2,
    },
    progressDotActive: {
        backgroundColor: COLORS.white,
        transform: [{ scale: 1.2 }],
    },
    progressDotCompleted: {
        backgroundColor: COLORS.secondary,
    },
    stepContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZES.padding,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: SIZES.base,
    },
    subtitle: {
        ...FONTS.body1,
        color: COLORS.backgroundSecondary,
        textAlign: 'center',
        marginBottom: SIZES.padding,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        ...FONTS.body1,
        color: COLORS.text,
        ...SHADOWS.medium,
    },
    photoContainer: {
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: width * 0.25,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    onboardingPhotoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    photoText: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        marginTop: SIZES.base,
    },
    gradeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: SIZES.padding,
        paddingHorizontal: SIZES.padding,
        marginTop: SIZES.padding,
    },
    gradeButton: {
        width: '45%',
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        marginBottom: SIZES.base,
        ...SHADOWS.medium,
    },
    gradeButtonSelected: {
        backgroundColor: COLORS.secondary,
    },
    gradeText: {
        ...FONTS.body1,
        color: COLORS.text,
    },
    gradeTextSelected: {
        color: COLORS.white,
    },
    errorText: {
        ...FONTS.body2,
        color: COLORS.danger,
        textAlign: 'center',
        marginTop: SIZES.padding,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SIZES.padding * 3,
        gap: SIZES.padding,
    },
    button: {
        paddingVertical: SIZES.padding,
        paddingHorizontal: SIZES.padding * 2,
        borderRadius: SIZES.radius,
        minWidth: 120,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    backButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    nextButton: {
        backgroundColor: COLORS.white,
    },
    buttonText: {
        ...FONTS.h4,
        color: COLORS.primary,
    },
    backButtonText: {
        color: COLORS.white,
    },
    profileSelectionContainer: {
        flex: 1,
        padding: SIZES.padding,
    },
    profileSelectionContentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    existingProfileCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        ...SHADOWS.medium,
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    welcomeText: {
        ...FONTS.h2,
        color: COLORS.white,
        textAlign: 'center',
        marginVertical: SIZES.padding,
    },
    deleteButton: {
        padding: SIZES.base,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    profilePhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileText: {
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
        marginTop: SIZES.base,
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    continueButtonText: {
        ...FONTS.h4,
        color: COLORS.white,
    },
    newProfileButton: {
        marginTop: SIZES.padding,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        alignItems: 'center',
    },
    newProfileButtonText: {
        ...FONTS.h4,
        color: COLORS.white,
    },
}); 