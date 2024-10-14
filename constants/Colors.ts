/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { useMyContextController } from "../store";

// Tạo hàm để lấy giá trị màu dựa trên darkMode
const useColors = () => {
    const [controller] = useMyContextController(); // Lấy darkMode từ context

    // Các giá trị màu cho chế độ light và dark
    const lightColors = {
        background: '#ffffff',
        text: '#000000',
        primary: '#6200ea',
        secondary: '#03dac4',
    };

    const darkColors = {
        background: '#121212',
        text: '#ffffff',
        primary: '#bb86fc',
        secondary: '#03dac4',
    };

    // Trả về màu dựa trên giá trị darkMode
    return controller.darkMode ? darkColors : lightColors;
};

export default useColors;



const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
    light: {
        darkmode: false,
        text: '#11181C',
        background: '#fff',
        tint: '#E50914', // Giả sử tintColorLight là '#E50914'
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: '#E50914',
        bgBlack: '#fffbfb',
        bgBlack2: '#f6f8ff',
        white: 'black',
        white2: '#626262',
        bgBlackRBG: 'rgba(255, 251, 251, 1)',

    },
    dark: {
        darkmode: true,
        text: '#ECEDEE',
        background: '#151718',
        tint: '#E50914', // Giả sử tintColorDark là '#E50914'
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: '#E50914',
        bgBlack: '#1A1A1D',
        bgBlack2: '#171717',
        white: 'white',
        white2: 'rgba(255,255,255,0.35)',
        bgBlackRBG: 'rgba(48, 48, 48, 0.5)',
    },
    bgBlack: '#1A1A1D',
    bgBlack2: '#121212',
    bgLight: '#F5F5F5',
    bgLight2: '#FFFFFF',
    heart: '#ff4ed9',
    textn300: 'rgb(163, 163, 163)',
    white: 'white',
    black: 'black',
    main: '#E50914',
    btn: '#A9A9A9',
    btn2: '#FFC107',
    btn3: '#0A84FF',
    c: '#3CB371',
    c2: '#42A5F5',
    yellow: '#FFC107',
    red: '#E50914',
    green: 'green',
    
};

// Tạo hàm để lấy giá trị màu sắc theo chế độ darkMode
export const useThemeColors = () => {
    const [controller] = useMyContextController(); // Lấy giá trị darkMode từ context
    return controller.darkMode ? Colors.dark : Colors.light; // Trả về màu sắc phù hợp
};

//  Đỏ chủ đạo: #E50914
// Nền tối: #1A1A1D hoặc #121212
// Nền sáng: #F5F5F5 hoặc #FFFFFF
// Màu phụ: #A9A9A9, #FFC107, #0A84FF
// Màu nhấn đặc biệt: #3CB371, #42A5F5


interface Spacing {
  space_2: number;
  space_4: number;
  space_8: number;
  space_10: number;
  space_12: number;
  space_15: number;
  space_16: number;
  space_18: number;
  space_20: number;
  space_24: number;
  space_28: number;
  space_32: number;
  space_36: number;
}

export const SPACING: Spacing = {
  space_2: 2,
  space_4: 4,
  space_8: 8,
  space_10: 10,
  space_12: 12,
  space_15: 15,
  space_16: 16,
  space_18: 18,
  space_20: 20,
  space_24: 24,
  space_28: 28,
  space_32: 32,
  space_36: 36,
};



interface FontFamily {
  poppins_black: string;
  poppins_bold: string;
  poppins_extrabold: string;
  poppins_extralight: string;
  poppins_light: string;
  poppins_medium: string;
  poppins_regular: string;
  poppins_semibold: string;
  poppins_thin: string;
}

export const FONTFAMILY: FontFamily = {
  // poppins_black: 'Poppins-Black',
  // poppins_bold: 'Poppins-Bold',
  // poppins_extrabold: 'Poppins-ExtraBold',
  // poppins_extralight: 'Poppins-ExtraLight',
  // poppins_light: 'Poppins-Light',
  // poppins_medium: 'Poppins-Medium',
  // poppins_regular: 'Poppins-Regular',
  // poppins_semibold: 'Poppins-SemiBold',
  // poppins_thin: 'Poppins-Thin',
  poppins_black: 'Roboto',
  poppins_bold: 'Roboto',
  poppins_extrabold: 'Roboto',
  poppins_extralight: 'Roboto',
  poppins_light: 'Roboto',
  poppins_medium: 'Roboto',
  poppins_regular: 'Roboto',
  poppins_semibold: 'Roboto',
  poppins_thin: 'Roboto',
};

interface FontSize {
  size_8: number;
  size_10: number;
  size_12: number;
  size_14: number;
  size_16: number;
  size_18: number;
  size_20: number;
  size_24: number;
  size_30: number;
}

export const FONTSIZE: FontSize = {
  size_8: 8,
  size_10: 10,
  size_12: 12,
  size_14: 14,
  size_16: 16,
  size_18: 18,
  size_20: 20,
  size_24: 24,
  size_30: 30,
};

interface BorderRadius {
  radius_4: number;
  radius_8: number;
  radius_10: number;
  radius_15: number;
  radius_20: number;
  radius_25: number;
}

export const BORDERRADIUS: BorderRadius = {
  radius_4: 4,
  radius_8: 8,
  radius_10: 10,
  radius_15: 15,
  radius_20: 20,
  radius_25: 25,
};
