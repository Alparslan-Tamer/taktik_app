import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    ...rest
}: ButtonProps) => {

    const getButtonStyle = () => {
        let buttonStyle: ViewStyle = {
            ...styles.button,
            ...(fullWidth && styles.fullWidth),
        };

        if (size === 'small') {
            buttonStyle = { ...buttonStyle, ...styles.buttonSmall };
        } else if (size === 'large') {
            buttonStyle = { ...buttonStyle, ...styles.buttonLarge };
        }

        if (disabled) {
            buttonStyle = { ...buttonStyle, opacity: 0.6 };
        }

        return buttonStyle;
    };

    const getContainerStyle = () => {
        if (variant === 'outline') {
            return {
                ...styles.outlineContainer,
                borderColor: disabled ? COLORS.border : COLORS.primary,
            };
        }
        return null;
    };

    const getTextStyle = () => {
        let color = COLORS.white;

        if (variant === 'outline') {
            color = disabled ? COLORS.textSecondary : COLORS.primary;
        }

        if (size === 'small') {
            return { ...styles.buttonText, ...styles.buttonTextSmall, color, ...textStyle };
        } else if (size === 'large') {
            return { ...styles.buttonText, ...styles.buttonTextLarge, color, ...textStyle };
        }

        return { ...styles.buttonText, color, ...textStyle };
    };

    const renderContent = () => (
        <>
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? COLORS.primary : COLORS.white}
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    <Text style={getTextStyle()}>{title}</Text>
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </>
    );

    if (variant === 'primary' || variant === 'secondary') {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                disabled={disabled || loading}
                style={[getButtonStyle(), style]}
                {...rest}
            >
                <LinearGradient
                    colors={variant === 'primary' ? COLORS.gradient : [COLORS.secondary, '#FF7043']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientContainer}
                >
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={disabled || loading}
            style={[getButtonStyle(), getContainerStyle(), style]}
            {...rest}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius,
        overflow: 'hidden',
    },
    fullWidth: {
        width: '100%',
    },
    buttonSmall: {
        height: 36,
        paddingHorizontal: SIZES.padding * 0.5,
    },
    buttonLarge: {
        height: 56,
        paddingHorizontal: SIZES.padding * 1.5,
    },
    gradientContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
    },
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        paddingHorizontal: SIZES.padding,
    },
    buttonText: {
        ...FONTS.body2,
        fontWeight: '600',
        color: COLORS.white,
    },
    buttonTextSmall: {
        ...FONTS.body3,
    },
    buttonTextLarge: {
        ...FONTS.h4,
    },
}); 