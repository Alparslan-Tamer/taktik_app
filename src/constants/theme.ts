import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
    // Ana renkler
    primary: '#6C63FF', // Modern mor renk - ana tema rengi
    secondary: '#FF8E6E', // Turuncu vurgu rengi
    success: '#4CAF50', // Başarılı yeşil
    danger: '#FF5252', // Hata kırmızı
    warning: '#FFC107', // Uyarı sarı

    // Nötr renkler
    background: '#F8F9FF', // Hafif mor tonda beyaz arkaplan
    backgroundSecondary: '#F0F2FF', // İkincil arkaplan
    card: '#FFFFFF', // Kart arkaplanı
    white: '#FFFFFF', // Beyaz
    black: '#000000', // Siyah
    text: '#333452', // Koyu lacivert ana metin rengi
    textSecondary: '#6E7191', // İkincil metin rengi
    border: '#E0E1F0', // Sınır çizgisi

    // Diğer renkler
    lightPurple: '#E5E3FF', // Açık mor
    mediumPurple: '#A5A1FF', // Orta mor
    darkPurple: '#4D47D1', // Koyu mor
    lightOrange: '#FFE0D7', // Açık turuncu
    gradient: ['#6C63FF', '#5D56F3'], // Gradient mor
};

export const SIZES = {
    // Global ölçüler
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // Font boyutları
    largeTitle: 28,
    h1: 24,
    h2: 20,
    h3: 18,
    h4: 16,
    h5: 14,
    body1: 16,
    body2: 14,
    body3: 12,
    small: 10,

    // App ölçüleri
    width,
    height,
};

export const FONTS = {
    largeTitle: { fontFamily: 'System', fontSize: SIZES.largeTitle, fontWeight: '700' as const },
    h1: { fontFamily: 'System', fontSize: SIZES.h1, fontWeight: '700' as const },
    h2: { fontFamily: 'System', fontSize: SIZES.h2, fontWeight: '600' as const },
    h3: { fontFamily: 'System', fontSize: SIZES.h3, fontWeight: '600' as const },
    h4: { fontFamily: 'System', fontSize: SIZES.h4, fontWeight: '600' as const },
    h5: { fontFamily: 'System', fontSize: SIZES.h5, fontWeight: '600' as const },
    body1: { fontFamily: 'System', fontSize: SIZES.body1, fontWeight: '400' as const },
    body2: { fontFamily: 'System', fontSize: SIZES.body2, fontWeight: '400' as const },
    body3: { fontFamily: 'System', fontSize: SIZES.body3, fontWeight: '400' as const },
    small: { fontFamily: 'System', fontSize: SIZES.small, fontWeight: '400' as const },
};

export const SHADOWS = {
    light: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 4,
    },
    dark: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6.27,
        elevation: 6,
    },
}; 