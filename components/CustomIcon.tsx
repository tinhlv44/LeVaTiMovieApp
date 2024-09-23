// CustomIcon.tsx
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
// Import thêm các icon khác nếu cần

// Định nghĩa type với các giá trị gợi ý cho `type`
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
  type?: IconType; // Chỉ có thể chọn các giá trị trong IconType
  name: string;
  size?: number;
  color?: string;
  style?: object;
  onPress?: () => void;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  type,
  name,
  size = 24,
  color = "black",
  style,
  onPress,
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
    <IconComponent
      //   name={name}
      name={type === 'MaterialCommunityIcons'
      || type === 'Entypo'
      || type === 'FontAwesome'
      || type === 'MaterialIcons'
      || type === 'Feather'
      || type === 'Ionicons'
      || type === 'AntDesign'
      || type === 'SimpleLineIcons'
      ? name : 'search'}
      size={size}
      color={color}
      style={style}
      onPress={onPress}
    />
  );
};

export default CustomIcon;
