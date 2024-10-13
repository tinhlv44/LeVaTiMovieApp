import { StyleSheet, Text} from 'react-native';
import { Colors } from '../constants/Colors';
const Logo = ({size}) =>{
    return(
        <Text style={[styles.logoStyle, {fontSize: size?size:24}]}>
            {/* <Text style={styles.logoStyleBold}>
                L
            </Text>e
            <Text style={styles.logoStyleBold}>
                V
            </Text>a
            <Text style={styles.logoStyleBold}>
                T
            </Text>i */}
            LeVaTi
            <Text style={styles.logoStyleBold}>
                M
            </Text>ovie
        </Text>
    );
}
export default Logo;
const styles = StyleSheet.create({
    logoStyle: {
        color:'white',
        fontSize:24,
        fontWeight:"bold",
    },
    logoStyleBold: {
        color:Colors.main,
      },
})