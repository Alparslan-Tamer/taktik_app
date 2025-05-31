import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface StudyTarget {
    subject: string;
    topic: string;
    targetCount: number;
    date: string;
    completed: boolean;
    duration?: number;
    timerState?: {
        isRunning: boolean;
        isPaused: boolean;
        startTime: number;
        elapsedTime: number;
    };
}

interface StudyTargetCardProps {
    target: StudyTarget;
    onPlay?: (target: StudyTarget) => void;
    onPause?: (target: StudyTarget) => void;
    onStop?: (target: StudyTarget) => void;
    onComplete?: (target: StudyTarget) => void;
    onDelete?: (target: StudyTarget) => void;
    formatDuration?: (target: StudyTarget) => string;
    disabled?: boolean;
}

export const StudyTargetCard = ({
    target,
    onPlay,
    onPause,
    onStop,
    onComplete,
    onDelete,
    formatDuration,
    disabled = false
}: StudyTargetCardProps) => {

    const isTimerActive = target.timerState?.isRunning;
    const isTimerPaused = target.timerState?.isPaused;

    // Hedef tarihi kontrolü
    const checkTargetDate = () => {
        const targetDate = new Date(target.date);
        targetDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (targetDate > today) {
            return 'future';
        } else if (targetDate < today) {
            return 'past';
        }
        return 'today';
    };

    // Butonları disable etmek için kontrol
    const isButtonDisabled = disabled || (() => {
        const dateStatus = checkTargetDate();
        // Gelecek tarihli veya geçmiş tarihli hedefler için butonlar deaktif
        return dateStatus === 'future' || dateStatus === 'past';
    })();

    const getStatusColor = () => {
        const dateStatus = checkTargetDate();

        if (target.completed) {
            return COLORS.success;
        }
        if (dateStatus === 'past') {
            return COLORS.textSecondary; // Geçmiş hedefler için soluk renk
        }
        if (isTimerActive) {
            return isTimerPaused ? COLORS.warning : COLORS.primary;
        }
        return COLORS.textSecondary;
    };

    const getStatusIcon = () => {
        const dateStatus = checkTargetDate();

        if (target.completed) {
            return 'checkmark-circle';
        }
        if (dateStatus === 'past') {
            return 'time-outline';
        }
        if (isTimerActive) {
            return isTimerPaused ? 'pause-circle' : 'play-circle';
        }
        return 'time-outline';
    };

    // Silme butonunun durumu için özel kontrol
    const isDeleteDisabled = target.completed || (() => {
        const dateStatus = checkTargetDate();
        return dateStatus === 'past'; // Geçmiş hedefler için silme butonu da deaktif
    })();

    return (
        <Card style={styles.container} shadow="light">
            <View style={styles.header}>
                <View style={styles.subjectContainer}>
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: getStatusColor() }
                        ]}
                    />
                    <Text style={styles.subject} numberOfLines={1}>
                        {target.subject}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => onDelete && onDelete(target)}
                    disabled={isDeleteDisabled}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name="trash-outline"
                        size={18}
                        color={target.completed ? COLORS.border : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.topic} numberOfLines={2}>
                    {target.topic}
                </Text>

                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Ionicons name="help-circle-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.metaText}>{target.targetCount} Soru</Text>
                    </View>

                    {(isTimerActive || target.duration !== undefined) && (
                        <View style={styles.metaItem}>
                            <Ionicons name={getStatusIcon()} size={16} color={getStatusColor()} />
                            <Text style={[styles.metaText, { color: getStatusColor() }]}>
                                {formatDuration ? formatDuration(target) : '0 dk'}
                            </Text>
                        </View>
                    )}
                </View>

                {target.completed ? (
                    <TouchableOpacity
                        style={styles.completedContainer}
                        onPress={() => onComplete && onComplete(target)}
                        disabled={isButtonDisabled}
                    >
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                        <Text style={styles.completedText}>Tamamlandı</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.actionContainer}>
                        {isTimerActive ? (
                            <>
                                {isTimerPaused ? (
                                    <TouchableOpacity
                                        style={[
                                            styles.iconButton,
                                            styles.playButton,
                                            isButtonDisabled && styles.disabledButton
                                        ]}
                                        onPress={() => onPlay && onPlay(target)}
                                        disabled={isButtonDisabled}
                                    >
                                        <Ionicons name="play" size={16} color={COLORS.white} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[
                                            styles.iconButton,
                                            styles.pauseButton,
                                            isButtonDisabled && styles.disabledButton
                                        ]}
                                        onPress={() => onPause && onPause(target)}
                                        disabled={isButtonDisabled}
                                    >
                                        <Ionicons name="pause" size={16} color={COLORS.white} />
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[
                                        styles.iconButton,
                                        styles.stopButton,
                                        isButtonDisabled && styles.disabledButton
                                    ]}
                                    onPress={() => onStop && onStop(target)}
                                    disabled={isButtonDisabled}
                                >
                                    <Ionicons name="stop" size={16} color={COLORS.white} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.completeButton,
                                        isButtonDisabled && styles.disabledButton
                                    ]}
                                    onPress={() => onComplete && onComplete(target)}
                                    disabled={isButtonDisabled}
                                >
                                    <Text style={[
                                        styles.completeButtonText,
                                        isButtonDisabled && styles.disabledButtonText
                                    ]}>Tamamla</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[
                                        styles.iconButton,
                                        styles.playButton,
                                        isButtonDisabled && styles.disabledButton
                                    ]}
                                    onPress={() => onPlay && onPlay(target)}
                                    disabled={isButtonDisabled}
                                >
                                    <Ionicons name="play" size={16} color={COLORS.white} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.completeButton,
                                        isButtonDisabled && styles.disabledButton
                                    ]}
                                    onPress={() => onComplete && onComplete(target)}
                                    disabled={isButtonDisabled}
                                >
                                    <Text style={[
                                        styles.completeButtonText,
                                        isButtonDisabled && styles.disabledButtonText
                                    ]}>Tamamla</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SIZES.base * 2,
        padding: SIZES.padding * 0.75,
        backgroundColor: COLORS.card,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.base,
    },
    subjectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    subject: {
        ...FONTS.h4,
        color: COLORS.text,
        flex: 1,
    },
    content: {
        marginTop: SIZES.base,
    },
    topic: {
        ...FONTS.body2,
        color: COLORS.textSecondary,
        marginBottom: SIZES.base,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.base * 1.5,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SIZES.padding,
    },
    metaText: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    completedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SIZES.base,
        backgroundColor: COLORS.lightPurple,
        borderRadius: SIZES.radius,
        opacity: 0.9,
    },
    completedText: {
        ...FONTS.h5,
        color: COLORS.success,
        marginLeft: SIZES.base,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.base,
        ...SHADOWS.light,
    },
    playButton: {
        backgroundColor: COLORS.primary,
    },
    pauseButton: {
        backgroundColor: COLORS.warning,
    },
    stopButton: {
        backgroundColor: COLORS.danger,
    },
    completeButton: {
        flex: 1,
        height: 36,
        backgroundColor: COLORS.success,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    completeButtonText: {
        ...FONTS.body3,
        color: COLORS.white,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: COLORS.border,
    },
    disabledButtonText: {
        color: COLORS.textSecondary,
    },
}); 