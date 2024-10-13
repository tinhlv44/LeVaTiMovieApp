import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../constants/theme";
import AppHeader from "../components/AppHeader";
import SettingComponent from "../components/SettingComponent";
import { Button } from "../components";
import { logout, useMyContextController } from "../store";
import { storageBucketUrl } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import FacebookLoginButton from "../components/Facebook";
import GoogleLoginButton from "../components/Google";
import { Colors } from "../constants/Colors";

var { width, height } = Dimensions.get("window");
const UserAccountScreen = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { uid } = controller;

  const handleLogout = () => {
    logout(dispatch);
  };

  useEffect(() => {
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          dispatch({ type: "USER_LOGIN", value: userData, uid });
        } else {
          console.log("No such document!");
        }
      });

      return () => unsubscribe();
    }
  }, [uid, dispatch]);

  const { userLogin } = controller;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        {userLogin ? (
          <View style={styles.container}>
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={"My Profile"}
                action={() => navigation.goBack()}
              />
            </View>
            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: `${storageBucketUrl}${encodeURIComponent(
                    userLogin.avatar
                  )}?alt=media&timestamp=${new Date().getTime()}`,
                }}
                style={styles.avatarImage}
              />
              <Text style={styles.avatarText}>{userLogin.fullName}</Text>
              <Text style={styles.avatarEmail}>{userLogin.email}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>

            <View style={styles.settingContainer}>
              <SettingComponent
                icon="user"
                heading="Tài khoản"
                subheading="Chỉnh sửa thông tin"
                onPress={() =>
                  navigation.navigate("UpdateUser", {
                    userId: uid,
                  })
                }
                type='AntDesign'
              />
              <SettingComponent
                icon="key-change"
                heading="Đổi mật khẩu"
                subheading="Đổi mật khẩu"
                onPress={() =>
                  navigation.navigate("ChangePassword", {
                    userId: uid,
                  })
                }
                type='MaterialCommunityIcons'
              />
              <SettingComponent
                icon="key-change"
                heading="Yêu thích"
                subheading="Danh sách phim yêu thích"
                onPress={() =>
                  navigation.navigate("FavoriteMovies")
                }
                type='MaterialCommunityIcons'
              />
              <SettingComponent
                icon="settings"
                heading="Cài đặt"
                subheading="Chủ đề"
                type="Feather"
              />
              <SettingComponent
                icon="dollar-sign"
                heading="Ưu đãi & Giới thiệu"
                subheading="Ưu đãi"
                subtitle="Giới thiệu"
                type="Feather"
              />
              <SettingComponent
                icon="info"
                heading="Thông tin"
                subheading="Tìm hiểu thêm"
              />
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <Button
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </Button>
            <Button
              style={styles.loginButton}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.buttonText}>Đăng ký</Text>
            </Button>
            <Text style={styles.linear}>Hoặc</Text>
            <FacebookLoginButton/>
            <GoogleLoginButton />            
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
    padding: SPACING.space_20,
  },
  appHeaderContainer: {
    marginBottom: SPACING.space_20,
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: SPACING.space_36,
  },
  avatarImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: SPACING.space_10,
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  avatarEmail: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
  },
  logoutButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.space_10,
    backgroundColor: "red",
    padding: SPACING.space_10,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
  },
  settingContainer: {
    marginTop: SPACING.space_20,
  },
  loginButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.space_10,
    backgroundColor: Colors.main,
    padding: SPACING.space_10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
  },
  linear: {
    color: COLORS.White,
    width:'100%',
    textAlign:'center',
    fontWeight:'bold',
    marginTop:10
  },
});

export default UserAccountScreen;
