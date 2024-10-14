import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import { changePasswordValidationSchema } from "../utils"; // Import validation schema
import { getAuth, updatePassword } from "firebase/auth"; // Import Firebase Auth
import { Colors, useThemeColors } from "../constants/Colors";

const ChangePasswordScreen = ({ route }) => {
  const { userId } = route.params; // Get userId from params
  const [loading, setLoading] = useState(false);
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode

  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword } = values;
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // Re-authenticate user with current password
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);

      // Update password
      await updatePassword(user, newPassword);
      Alert.alert("Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Đổi mật khẩu thất bại! Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor:colors.bgBlack}]}>

      <Formik
        initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
        validationSchema={changePasswordValidationSchema} // Thêm schema xác thực
        onSubmit={handleChangePassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={[styles.input, {backgroundColor: colors.bgBlack2, color:colors.white}]}
              placeholder="Mật khẩu hiện tại"
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={handleChange("currentPassword")}
              onBlur={handleBlur("currentPassword")}
              value={values.currentPassword}
            />
            {errors.currentPassword && touched.currentPassword && (
              <Text style={styles.errorText}>{errors.currentPassword}</Text>
            )}
            
            <TextInput
              style={[styles.input, {backgroundColor: colors.bgBlack2, color:colors.white}]}
              placeholder="Mật khẩu mới"
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={handleChange("newPassword")}
              onBlur={handleBlur("newPassword")}
              value={values.newPassword}
            />
            {errors.newPassword && touched.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            )}

            <TextInput
              style={[styles.input, {backgroundColor: colors.bgBlack2, color:colors.white}]}
              placeholder="Xác nhận mật khẩu mới"
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.changePasswordButtonText}>
                {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#fff", // Màu chữ trắng
  },
  input: {
    height: 50,
    borderColor: "#555",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#fff", // Màu chữ trắng
    backgroundColor: "#222", // Nền input
    borderRadius: 5,
  },
  changePasswordButton: {
    backgroundColor: Colors.main,
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    width: '100%',
    alignItems:'center'
  },
  changePasswordButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default ChangePasswordScreen;
