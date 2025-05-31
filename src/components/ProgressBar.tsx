import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface ProgressBarProps {
    progress: number; // 0 to 1
    height?: number;
    backgroundColor?: string;
    progressColor?: string;
    style?: ViewStyle;
    animated?: boolean;
}

export const ProgressBar = ({
    progress,
    height = 8,
    backgroundColor = COLORS.backgroundSecondary,
    progressColor = COLORS.primary,
    style,
    animated = true,
}: ProgressBarProps) => {

    // Clamp progress between 0 and 1
    const normalizedProgress = Math.min(Math.max(progress, 0), 1);

    // Animated value for the progress width
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animated) {
            Animated.timing(progressAnim, {
                toValue: normalizedProgress,
                duration: 500,
                useNativeDriver: false,
            }).start();
        } else {
            progressAnim.setValue(normalizedProgress);
        }
    }, [normalizedProgress, animated, progressAnim]);

    return (
        <View
            style={[
                styles.container,
                { height, backgroundColor },
                style
            ]}
        >
            {animated ? (
                <Animated.View
                    style={[
                        styles.progressFill,
                        {
                            width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                            }),
                            backgroundColor: progressColor,
                        }
                    ]}
                />
            ) : (
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${normalizedProgress * 100}%`,
                            backgroundColor: progressColor,
                        }
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: SIZES.radius / 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: SIZES.radius / 2,
    },
}); 