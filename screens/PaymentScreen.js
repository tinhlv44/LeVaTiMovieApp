import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Sử dụng cho PayPal
import { MaterialIcons } from "@expo/vector-icons"; // Sử dụng cho Google Pay
import PaypalButton from "../components/Paypal";
import GooglePayButton from "../components/GooglePay";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../components";
import { Colors, SPACING } from "../constants/Colors";

const PaymentScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn phương thức thanh toán</Text>
      <PaypalButton />
      <GooglePayButton />
      <Button style={styles.button} onPress={() => navigation.pop(2)}>
        <Text style={styles.buttonText}>Thanh toán sau</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bgBlack,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.white,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bgBlack2,
    padding: SPACING.space_10,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
  },
});

export default PaymentScreen;
