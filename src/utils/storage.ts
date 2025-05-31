import AsyncStorage from '@react-native-async-storage/async-storage';
import { EducationLevel, GradeLevel } from '../types';

export const getEducationLevel = async (): Promise<EducationLevel | null> => {
    try {
        const level = await AsyncStorage.getItem('educationLevel');
        return level as EducationLevel | null;
    } catch (error) {
        console.error('Error getting education level:', error);
        return null;
    }
};

export const getGradeLevel = async (): Promise<GradeLevel | null> => {
    try {
        const level = await AsyncStorage.getItem('gradeLevel');
        return level ? parseInt(level) as GradeLevel : null;
    } catch (error) {
        console.error('Error getting grade level:', error);
        return null;
    }
};

export const setEducationLevel = async (level: EducationLevel): Promise<void> => {
    try {
        await AsyncStorage.setItem('educationLevel', level);
    } catch (error) {
        console.error('Error setting education level:', error);
    }
};

export const setGradeLevel = async (level: GradeLevel): Promise<void> => {
    try {
        await AsyncStorage.setItem('gradeLevel', level.toString());
    } catch (error) {
        console.error('Error setting grade level:', error);
    }
}; 