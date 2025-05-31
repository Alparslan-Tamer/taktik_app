import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';

interface CardProps extends ViewProps {
    style?: ViewStyle;
    children: React.ReactNode;
    variant?: 'default' | 'outlined' | 'flat';
    shadow?: 'none' | 'light' | 'medium' | 'dark';
}

export const Card = ({
    style,
    children,
    variant = 'default',
    shadow = 'medium',
    ...rest
}: CardProps) => {

    const getCardStyle = () => {
        let cardStyle: ViewStyle = {
            ...styles.card
        };

        // Variant styles
        if (variant === 'outlined') {
            cardStyle = {
                ...cardStyle,
                ...styles.outlined
            };
        } else if (variant === 'flat') {
            cardStyle = {
                ...cardStyle,
                ...styles.flat
            };
        }

        // Shadow styles
        if (shadow !== 'none' && variant !== 'flat') {
            cardStyle = {
                ...cardStyle,
                ...SHADOWS[shadow]
            };
        }

        return cardStyle;
    };

    return (
        <View style={[getCardStyle(), style]} {...rest}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginVertical: SIZES.base,
    },
    outlined: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    flat: {
        backgroundColor: COLORS.backgroundSecondary,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { height: 0, width: 0 },
        elevation: 0,
    },
}); 