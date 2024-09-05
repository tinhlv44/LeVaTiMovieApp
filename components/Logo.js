import { StyleSheet, Text} from 'react-native';
const Logo = () =>{
    return(
        <Text style={styles.logoStyle}>
            <Text style={styles.logoStyleBold}>
                L
            </Text>e
            <Text style={styles.logoStyleBold}>
                V
            </Text>a
            <Text style={styles.logoStyleBold}>
                T
            </Text>i
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
        fontWeight:"bold"
    },
    logoStyleBold: {
        color:'green',
      },
})