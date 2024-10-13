import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

type IconType =
  | "MaterialIcons"
  | "FontAwesome"
  | "Ionicons"
  | "Feather"
  | "MaterialCommunityIcons"
  | "Entypo"
  | "AntDesign"
  | "SimpleLineIcons";

interface CustomIconProps {
  type?: IconType;
  name: string;
  size?: number;
  color?: string;
  style?: object;
  styleText?: object;
  onPress?: () => void;
  onText?: string; // Thay đổi từ `ontext` thành `onText` để dễ đọc hơn
}

const CustomIcon: React.FC<CustomIconProps> = ({
  type,
  name,
  size = 24,
  color = "black",
  style,
  onPress,
  onText,
  styleText
}) => {
  let IconComponent;

  // Lựa chọn bộ icon dựa trên `type`
  switch (type) {
    case "MaterialIcons":
      IconComponent = MaterialIcons;
      break;
    case "FontAwesome":
      IconComponent = FontAwesome;
      break;
    case "Ionicons":
      IconComponent = Ionicons;
      break;
    case "Feather":
      IconComponent = Feather;
      break;
    case "MaterialCommunityIcons":
      IconComponent = MaterialCommunityIcons;
      break;
    case "Entypo":
      IconComponent = Entypo;
      break;
    case "AntDesign":
      IconComponent = AntDesign;
      break;
    case "SimpleLineIcons":
      IconComponent = SimpleLineIcons;
      break;
    default:
      IconComponent = MaterialIcons; // Đặt mặc định nếu không có `type`
      break;
  }

  return (
    <View style={styles.container}>
      <IconComponent
        name={name}
        size={size}
        color={color}
        style={style}
        onPress={onPress}
      />
      {onText && ( // Kiểm tra xem có text hay không
        <View style={styles.textContainer}>
          <Text style={[styles.text, styleText]}>{onText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative', // Để badge có thể đặt ở vị trí tuyệt đối
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    top:5
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default CustomIcon;
