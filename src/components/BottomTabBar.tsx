import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreen } from '../screens/SettingsScreen';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabItem {
    key: string;
    label: string;
    iconActive: IconName;
    iconInactive: IconName;
    screen: BottomTabScreen;
}

interface BottomTabBarProps {
    activeScreen: BottomTabScreen;
    onTabPress: (screen: BottomTabScreen) => void;
}

export const BottomTabBar = ({ activeScreen, onTabPress }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();

    const tabs: TabItem[] = [
        {
            key: 'home',
            label: 'Ana Sayfa',
            iconActive: 'home',
            iconInactive: 'home-outline',
            screen: 'Main' as BottomTabScreen,
        },
        {
            key: 'logs',
            label: 'Kayıtlar',
            iconActive: 'list',
            iconInactive: 'list-outline',
            screen: 'StudyLog' as BottomTabScreen,
        },
        {
            key: 'settings',
            label: 'Ayarlar',
            iconActive: 'settings',
            iconInactive: 'settings-outline',
            screen: 'Settings' as BottomTabScreen,
        },
    ];

    return (
        <View
            style={[
                styles.container,
                { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
                SHADOWS.medium
            ]}
        >
            {tabs.map((tab) => {
                const isActive = activeScreen === tab.screen;

                return (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tabItem}
                        onPress={() => onTabPress(tab.screen)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.tabContent}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    isActive && {
                                        backgroundColor: COLORS.lightPurple,
                                    }
                                ]}
                            >
                                <Ionicons
                                    name={isActive ? tab.iconActive : tab.iconInactive}
                                    size={20}
                                    color={isActive ? COLORS.primary : COLORS.textSecondary}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.tabLabel,
                                    isActive && styles.activeTabLabel
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </View>

                        {isActive && (
                            <View style={styles.activeIndicator} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tabItem: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 4,
    },
    tabLabel: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    activeTabLabel: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        top: -10,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
    },
}); 