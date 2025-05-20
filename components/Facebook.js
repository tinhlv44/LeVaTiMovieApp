import React from "react";
import { TouchableOpacity, Text, StyleSheet,Alert } from "react-native";
import CustomIcon from "./CustomIcon";

const FacebookLoginButton = ({ onPress }) => {
  const handleFail = ()=>{
    Alert.alert("Thông báo","Tính năng đang bảo trì.");
  }
  return (
    <TouchableOpacity style={styles.button} onPress={handleFail}>
      <CustomIcon name="facebook-square" size={24} color="#FFFFFF" type="AntDesign"/>
      <Text style={styles.buttonText}>Đăng nhập với Facebook</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b5998", // Màu xanh Facebook
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default FacebookLoginButton;
