import { StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/Colors';

const Logo = ({ size }) => {
    return (
        <Text style={[styles.logoStyle, { fontSize: size ? size : 24 }]}>
            LeVaTi
            <Text style={styles.logoStyleBold}>
                M
            </Text>
            ovie
        </Text>
    );
};

export default Logo;

const styles = StyleSheet.create({
    logoStyle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        // Thêm viền đen cho chữ
        textShadowColor: Colors.main, // Màu của viền
        textShadowOffset: { width: 0.1, height: 0.1 }, // Độ lệch của viền
        textShadowRadius: 3, // Độ mờ của viền
    },
    logoStyleBold: {
        color: Colors.main,
    },
});
