import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SettingComponent from "../components/SettingComponent";
import { Button } from "../components";
import { logout, useMyContextController } from "../store";
import { storageBucketUrl } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import FacebookLoginButton from "../components/Facebook";
import GoogleLoginButton from "../components/Google";
import {
  Colors,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  useThemeColors,
} from "../constants/Colors";
import DarkModeToggle from "../components/DarkModeToggle";
import { nullAvatarUser } from "../api/moviedb";

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
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View
          style={[styles.container, { backgroundColor: colors.bgBlack }]}
        >
          {userLogin ? (
            <>
              <View style={styles.profileContainer}>
                <Image
                  source={{
                    uri: userLogin?.avatar===null? nullAvatarUser : `${storageBucketUrl}${encodeURIComponent(
                      userLogin.avatar
                    )}?alt=media&timestamp=${new Date().getTime()}`,
                  }}
                  style={styles.avatarImage}
                />
                <Text style={[styles.avatarText, { color: colors.white }]}>
                  {userLogin.fullName}
                </Text>
                <Text style={[styles.avatarEmail, { color: colors.white }]}>
                  {userLogin.email}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
              </TouchableOpacity>

              <View style={styles.settingContainer}>
                <Text style={[styles.title, { color: colors.white }]}>
                  Tài khoản
                </Text>
                <View
                  style={[
                    [styles.settingGroup, { backgroundColor: colors.bgBlack2 }],
                    { backgroundColor: colors.bgBlack2 },
                  ]}
                >
                  <SettingComponent
                    icon="user"
                    heading="Tài khoản"
                    subheading="Chỉnh sửa thông tin"
                    onPress={() =>
                      navigation.navigate("UpdateUser", {
                        userId: uid,
                      })
                    }
                    type="AntDesign"
                  />
                  <SettingComponent
                    icon="key-change"
                    heading="Đổi mật khẩu"
                    subheading="Đổi mật khẩu"
                    onPress={() =>
                      navigation.navigate("ChangePassword", {
                        userId: uid,
                        email: userLogin.email
                      })
                    }
                    type="MaterialCommunityIcons"
                  />
                </View>
                <Text style={[styles.title, { color: colors.white }]}>
                  Tiện ích
                </Text>
                <View
                  style={[
                    styles.settingGroup,
                    { backgroundColor: colors.bgBlack2 },
                  ]}
                >
                  <SettingComponent
                    icon="heart"
                    heading="Yêu thích"
                    subheading="Danh sách phim yêu thích"
                    onPress={() => navigation.navigate("FavoriteMovies")}
                    type="AntDesign"
                  />
                </View>
              </View>
            </>
          ) : (
            <>
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
              <Text style={[styles.linear,{color:colors.white}]}>Hoặc</Text>
              <FacebookLoginButton />
              <GoogleLoginButton />
            </>
          )}
          <Text style={[styles.title, { color: colors.white }]}>Cài đặt</Text>
          <View
            style={[styles.settingGroup, { backgroundColor: colors.bgBlack2 }]}
          >
            {/* <SettingComponent
                icon="settings"
                heading="Cài đặt"
                subheading="Chủ đề"
                type="Feather"
              /> */}
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
              onPress={() => navigation.navigate("AboutScreen")}
            />
            <View style={styles.toggleContainer}>
              <Text style={[styles.avatarText, { color: colors.white }]}>
                Chế độ tối
              </Text>
              <DarkModeToggle />
            </View>
            {/* <View style={styles.toggleContainer}>
                  <Text style={styles.avatarText}>Chế độ tối</Text>
                  <DarkModeToggle />
                </View> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.space_20,
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: SPACING.space_10,
  },
  avatarImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: SPACING.space_10,
    borderColor:'black', 
    borderWidth: 1
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_20,
  },
  avatarEmail: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
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
    color: Colors.white,
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
  toggleContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  settingGroup: {
    borderRadius: 8,
    marginVertical: SPACING.space_10,
  },
  linear:{
    textAlign: 'center',
    fontWeight: '600'
  }
});

export default UserAccountScreen;
