export const theme = {
    colors: {
        primary: {
            300: '#8B85FF',
            400: '#7A73FF',
            500: '#6C63FF',
            600: '#5E54FF',
            700: '#4F44FF',
        },
        secondary: {
            300: '#FFA68E',
            400: '#FF997E',
            500: '#FF8E6E',
            600: '#FF825E',
            700: '#FF764E',
        },
        success: {
            500: '#4CAF50',
        },
        warning: {
            500: '#FFC107',
        },
        error: {
            500: '#F44336',
        },
        gray: {
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#9E9E9E',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
        },
        white: '#FFFFFF',
        black: '#000000',
        background: '#F8F9FA',
        darkPurple: '#4D47D1',
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    typography: {
        h1: {
            fontSize: 32,
            fontWeight: '700',
            lineHeight: 40,
        },
        h2: {
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 32,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 28,
        },
        h4: {
            fontSize: 18,
            fontWeight: '600',
            lineHeight: 24,
        },
        body1: {
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 24,
        },
        body2: {
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 20,
        },
        button: {
            fontSize: 16,
            fontWeight: '600',
            lineHeight: 24,
        },
    },

    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
    },

    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 5,
        },
    },
} as const; 