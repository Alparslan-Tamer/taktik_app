import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderBarProps {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
    style?: ViewStyle;
    transparent?: boolean;
}

export const HeaderBar = ({
    title,
    showBackButton = true,
    onBackPress,
    rightComponent,
    style,
    transparent = false,
}: HeaderBarProps) => {
    const insets = useSafeAreaInsets();

    return (
        <>
            <StatusBar
                barStyle={transparent ? "light-content" : "dark-content"}
                backgroundColor={transparent ? "transparent" : COLORS.background}
                translucent
            />
            <View
                style={[
                    styles.container,
                    {
                        paddingTop: insets.top + 10,
                        backgroundColor: transparent ? 'transparent' : COLORS.background,
                        ...(!transparent && SHADOWS.light),
                    },
                    style
                ]}
            >
                <View style={styles.leftContainer}>
                    {showBackButton && (
                        <TouchableOpacity
                            onPress={onBackPress}
                            style={styles.backButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={26}
                                color={transparent ? COLORS.white : COLORS.primary}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <Text
                    style={[
                        styles.title,
                        { color: transparent ? COLORS.white : COLORS.text }
                    ]}
                    numberOfLines={1}
                >
                    {title}
                </Text>

                <View style={styles.rightContainer}>
                    {rightComponent}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        paddingHorizontal: SIZES.padding,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: 4,
    },
    title: {
        ...FONTS.h3,
        flex: 3,
        textAlign: 'center',
    },
}); 