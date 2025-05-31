export type EducationLevel = 'primary' | 'secondary' | 'high';

export type GradeLevel = 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface User {
    educationLevel: EducationLevel;
}

export interface Subject {
    id: string;
    name: string;
    educationLevel: EducationLevel;
}

export interface StudyTarget {
    subject: string;
    topic: string;
    targetCount: number;
    date: string;
    completed?: boolean;
    duration?: number;
    isTimerRunning?: boolean;
    isTimerPaused?: boolean;
    timerStartTime?: number;
    pausedDuration?: number;
}

export interface DailyStudyRecord {
    date: string;
    records: {
        subject: string;
        topic: string;
        questionCount: number;
        duration: number;
        timestamp: string;
    }[];
}

export interface UserProfile {
    name: string;
    grade: GradeLevel;
    photo?: string;
    photoUri?: string;
    createdAt: string;
} 