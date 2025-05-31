import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
    Main: undefined;
    StudyLog: undefined;
    Settings: undefined;
};

export type RootStackParamList = {
    Onboarding: undefined;
    Main: undefined;
    StudyLog: undefined;
    StudyPlan: { selectedDate: string };
    Settings: undefined;
    EditProfile: undefined;
    Notification: undefined;
    Privacy: undefined;
    About: undefined;
    RateApp: undefined;
    ShareApp: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
} 