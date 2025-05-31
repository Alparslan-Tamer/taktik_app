import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleDailyReminder } from '../utils/notifications';
import { UserProfile } from '../types';

interface ProfileContextType {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile | null) => void;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            // First try to load from activeProfile
            const activeProfile = await AsyncStorage.getItem('activeProfile');
            if (activeProfile) {
                const parsedProfile = JSON.parse(activeProfile);
                setProfile(parsedProfile);
                // Also save to userProfile for backwards compatibility
                await AsyncStorage.setItem('userProfile', activeProfile);
                setLoading(false);
                return;
            }

            // If no activeProfile, try legacy userProfile
            const savedProfile = await AsyncStorage.getItem('userProfile');
            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                setProfile(parsedProfile);
                // Migrate to activeProfile
                await AsyncStorage.setItem('activeProfile', savedProfile);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        try {
            const updatedProfile = profile ? { ...profile, ...updates } : updates as UserProfile;
            // Update both storage locations
            await AsyncStorage.setItem('activeProfile', JSON.stringify(updatedProfile));
            await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            setProfile(updatedProfile);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    return (
        <ProfileContext.Provider
            value={{
                profile,
                setProfile,
                updateProfile,
                loading,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}; 