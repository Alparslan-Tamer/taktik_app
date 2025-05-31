import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { EducationLevel, GradeLevel } from '../types';
import { getEducationLevel, getGradeLevel, setEducationLevel, setGradeLevel } from '../utils/storage';

interface UserContextType {
    educationLevel: EducationLevel;
    gradeLevel: GradeLevel;
    setUserInfo: (educationLevel: EducationLevel, gradeLevel: GradeLevel) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [educationLevel, setEducationLevelState] = useState<EducationLevel>('high');
    const [gradeLevel, setGradeLevelState] = useState<GradeLevel>(9);

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const savedEducationLevel = await getEducationLevel();
                const savedGradeLevel = await getGradeLevel();

                if (savedEducationLevel) {
                    setEducationLevelState(savedEducationLevel);
                }
                if (savedGradeLevel) {
                    setGradeLevelState(savedGradeLevel);
                }
            } catch (error) {
                console.error('Error loading user info:', error);
            }
        };

        loadUserInfo();
    }, []);

    const setUserInfo = async (newEducationLevel: EducationLevel, newGradeLevel: GradeLevel) => {
        try {
            await setEducationLevel(newEducationLevel);
            await setGradeLevel(newGradeLevel);
            setEducationLevelState(newEducationLevel);
            setGradeLevelState(newGradeLevel);
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    return (
        <UserContext.Provider value={{ educationLevel, gradeLevel, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}; 