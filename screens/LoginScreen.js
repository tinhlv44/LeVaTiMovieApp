import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { auth } from '../firebaseConfig';
import { View, TextInput, Button, FormErrorMessage } from "../components";
import { Images, Colors } from "../config";
import { useTogglePasswordVisibility } from "../hooks";
import { loginValidationSchema } from "../utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { login, useMyContextController } from "../store";
import Logo from "../components/Logo";
import { useThemeColors } from "../constants/Colors";
import FacebookLoginButton from "../components/Facebook";
import GoogleLoginButton from "../components/Google";

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state loading
  const { passwordVisibility, handlePasswordVisibility, rightIcon } = useTogglePasswordVisibility();
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode

  const handleLogin = async (values) => {
    setErrorState("");
    const { email, password } = values;

    // Bắt đầu loading
    setLoading(true);

    try {
      await login(dispatch, email, password);
    } catch (e) {
      console.log(e.message);
      setErrorState("Email hoặc mật khẩu không đúng.");
    } finally {
      // Kết thúc loading
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLogin) {
      navigation.goBack();
    }
  }, [userLogin]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bgBlack }]}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        {/* Logo và tiêu đề */}
        <View style={styles.logoContainer}>
          <Logo size={40} />
        </View>

        {/* Form đăng nhập */}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <>
              {/* Input Email */}
              <TextInput
                name="email"
                leftIconName="email"
                placeholder="Nhập email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />

              {/* Input Password */}
              <TextInput
                name="password"
                leftIconName="key-variant"
                placeholder="Nhập mật khẩu"
                autoCapitalize="none"
                secureTextEntry={passwordVisibility}
                textContentType="password"
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />

              {/* Hiển thị lỗi */}
              {errorState !== "" ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}

              {/* Nút Đăng nhập */}
              <Button style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Đăng nhập</Text>
                )}
              </Button>
            </>
          )}
        </Formik>

        <Text style={[styles.linear, { color: colors.white }]}>Hoặc</Text>
        <FacebookLoginButton />
        <GoogleLoginButton />
        
        {/* Button điều hướng đến màn hình Đăng ký */}
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={"Tạo tài khoản mới?"}
          onPress={() => navigation.navigate('Signup')}
        />
        
        {/* Button quên mật khẩu */}
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={"Quên mật khẩu?"}
          onPress={() => navigation.navigate('ForgotPassword')}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 80,
  },
  logoContainer: {
    alignItems: "center",
    padding: 30,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.black,
    paddingTop: 20,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: Colors.main,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "700",
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  linear: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
