import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import CustomIcon from "./CustomIcon";

const PaypalButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <CustomIcon name="google-pay" size={24} color="#FFFFFF" type="FontAwesome5"/>
      <Text style={styles.buttonText}>Pay with PayPal</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003087", // Màu đỏ Google
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%'
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default PaypalButton;
