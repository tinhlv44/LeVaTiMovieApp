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
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase Auth
import { auth } from '../firebaseConfig';
import { Colors, useThemeColors } from "../constants/Colors";

const ChangePasswordScreen = ({navigation, route }) => {
  const { email } = route.params; // Get userId from params
  const [loading, setLoading] = useState(false);
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode
  const user = auth.currentUser;
  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword } = values;
    setLoading(true);

    if (user) {
      try {
        // Yêu cầu đăng nhập lại với email và mật khẩu hiện tại
        await signInWithEmailAndPassword(auth, user.email, currentPassword);
        
        // Thay đổi mật khẩu
        await updatePassword(user, newPassword);
        alert('Mật khẩu đã được thay đổi thành công!');
        console.log('Mật khẩu đã được thay đổi thành công!');
        setLoading(false);
        navigation.goBack()
      } catch (error) {
        // Bắt lỗi và hiển thị thông báo phù hợp
        if (error.code === 'auth/wrong-password') {
          console.log('Mật khẩu hiện tại không chính xác.');
          alert('Mật khẩu hiện tại không chính xác. Vui lòng thử lại.');
        } else if (error.code === 'auth/weak-password') {
          console.log('Mật khẩu mới quá yếu. Cần ít nhất 6 ký tự.');
          alert('Mật khẩu mới quá yếu. Cần ít nhất 6 ký tự.');
        } else if (error.code === 'auth/requires-recent-login') {
          console.log('Cần đăng nhập lại để thực hiện thay đổi này.');
          alert('Cần đăng nhập lại để thực hiện thay đổi này.');
        } else if (error.code === 'auth/user-token-expired') {
          console.log('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          console.log('Lỗi khi thay đổi mật khẩu:', error.message);
          alert('Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại.');
        }
      }
      finally{
        setLoading(false);

      }
    } else {
      console.log('Người dùng không được xác thực.');
      alert('Người dùng không được xác thực. Vui lòng đăng nhập.');
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
