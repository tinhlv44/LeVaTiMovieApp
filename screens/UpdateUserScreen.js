import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import { db } from "../firebaseConfig"; // Import Firebase configuration
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { uploadBytes, ref } from "firebase/storage"; // Import necessary functions from Firebase Storage
import { storage, storageBucketUrl } from "../firebaseConfig"; // Import Firebase Storage
import { updateUserValidationSchema } from "../utils";
import { Colors, useThemeColors } from "../constants/Colors";



const UpdateUserScreen = ({ route }) => {
  const { userId } = route.params; // Get userId from params
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));

        if (userDoc.exists()) {
          const data = userDoc.data();
          setInitialValues(data);
          setSelectedImage(
            `${storageBucketUrl}${encodeURIComponent(data.avatar)}?alt=media&timestamp=${new Date().getTime()}` || null
          ); // Set selectedImage based on existing avatar
        } else {
          Alert.alert("Người dùng không tồn tại!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Lỗi khi lấy thông tin người dùng.");
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdate = async (values) => {
    try {
      const updatedValues = { ...values };
      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `avatars/${userId}`);
        await uploadBytes(storageRef, blob);
        updatedValues.avatar = `avatars/${userId}`; // Update avatar path for Firestore
      } else {
        updatedValues.avatar = initialValues.avatar; // Retain existing avatar path
      }
      await updateDoc(doc(db, "users", userId), updatedValues);
      Alert.alert("Thông tin người dùng đã được cập nhật thành công!");
      setSelectedImage(null); // Clear selected image after update

    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Cập nhật thông tin thất bại!");
    }
  };

  const pickImage = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Bạn cần cấp quyền truy cập vào thư viện ảnh để chọn ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }, []);

  return (
    <View style={[styles.container, {backgroundColor:colors.bgBlack}]}>
      {selectedImage || initialValues.avatar ? (
        <Image
          source={{
            uri: selectedImage
              ? selectedImage
              : initialValues.avatar
              ? `${storageBucketUrl}${encodeURIComponent(
                  initialValues.avatar
                )}?alt=media`
              : null,
          }}
          style={styles.avatar}
        />
      ) : null}
      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.pickImageButtonText}>Chọn avatar</Text>
      </TouchableOpacity>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={updateUserValidationSchema} // Add validation schema
        onSubmit={handleUpdate}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <TextInput
              style={[styles.input, {backgroundColor: colors.bgBlack2, color:colors.white}]}
              placeholder="Họ và tên"
              placeholderTextColor="#888"
              onChangeText={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              value={values.fullName}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            <TextInput
              style={[styles.input, {backgroundColor: colors.bgBlack2, color:colors.white}]}
              placeholder="Số điện thoại"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              onChangeText={handleChange("phone")}
              onBlur={handleBlur("phone")}
              value={values.phone}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            <TextInput
              style={[styles.input, {backgroundColor: colors.bgBlack2, color:colors.white}]}
              placeholder="Địa chỉ"
              placeholderTextColor="#888"
              onChangeText={handleChange("address")}
              onBlur={handleBlur("address")}
              value={values.address}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
              <Text style={styles.updateButtonText}>Cập nhật</Text>
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "center",
  },
  pickImageButton: {
    backgroundColor: Colors.main,
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 20,
  },
  pickImageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#555",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: Colors.main,
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    width:'100%',
    alignItems:'center'
  },
  updateButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default UpdateUserScreen;
