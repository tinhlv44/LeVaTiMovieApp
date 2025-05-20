import React from "react";
import { TouchableOpacity, Text, StyleSheet,Alert } from "react-native";
import CustomIcon from "./CustomIcon";

const GooglePayButton = ({ onPress }) => {
  const handleFail = ()=>{
    Alert.alert("Thông báo","Tính năng đang bảo trì.");
  }
  return (
    <TouchableOpacity style={styles.button} onPress={handleFail}>
      <CustomIcon name="google-pay" size={24} color="#FFFFFF" type="FontAwesome5"/>
      <Text style={styles.buttonText}>Pay with Google Pay</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DB4437", // Màu đỏ Google
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

export default GooglePayButton;
