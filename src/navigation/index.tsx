import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from '@screens/MainScreen';
import { StudyLogScreen } from '@screens/StudyLogScreen';
import { SettingsScreen } from '@screens/SettingsScreen';
import { StudyPlanScreen } from '@screens/StudyPlanScreen';
import OnboardingScreen from '@screens/OnboardingScreen';
import { EditProfileScreen } from '@screens/EditProfileScreen';
import NotificationScreen from '@screens/NotificationScreen';
import { ProfileProvider } from '../context/ProfileContext';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { AboutScreen } from '../screens/AboutScreen';

export type RootStackParamList = {
    Main: undefined;
    StudyLog: undefined;
    Settings: undefined;
    StudyPlan: { selectedDate?: string };
    Onboarding: undefined;
    EditProfile: undefined;
    Notification: undefined;
    Privacy: undefined;
    About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
    return (
        <NavigationContainer>
            <ProfileProvider>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="StudyLog" component={StudyLogScreen} />
                    <Stack.Screen name="StudyPlan" component={StudyPlanScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                    <Stack.Screen name="Notification" component={NotificationScreen} />
                    <Stack.Screen name="Privacy" component={PrivacyScreen} />
                    <Stack.Screen name="About" component={AboutScreen} />
                </Stack.Navigator>
            </ProfileProvider>
        </NavigationContainer>
    );
} 