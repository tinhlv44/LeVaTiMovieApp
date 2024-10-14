import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../constants/theme";
import CustomIcon from "./CustomIcon";
import { useThemeColors } from "../constants/Colors";

const SettingComponent = (props: any) => {
  
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode
  return (
    <TouchableOpacity style={styles.container} onPress={props?.onPress} activeOpacity={0.7}>
      <View>
        <CustomIcon name={props.icon} style={[styles.iconStyle, {color: colors.white}]} type={props.type} />
      </View>
      <View style={styles.settingContainer}>
        <Text style={[styles.title, {color: colors.white}]}>{props.heading}</Text>
        <Text style={[styles.subtitle, {color: colors.white2}]}>{props.subheading}</Text>
        <Text style={[styles.subtitle, {color: colors.white2}]}>{props.subtitle}</Text>
      </View>
      <View style={styles.iconBG}>
        <CustomIcon
          name={"arrow-right"}
          style={[styles.arrowIcon, {color: colors.white}]}
          type="SimpleLineIcons"
        />
      </View>
    </TouchableOpacity>
  );
};

export default SettingComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_12,
    alignItems: "center",    
  },
  settingContainer: {
    flex: 1,
    marginLeft: SPACING.space_12, // Thêm khoảng cách giữa icon và text
  },
  iconStyle: {
    fontSize: FONTSIZE.size_24,
  },
  arrowIcon: {
    fontSize: FONTSIZE.size_20,
  },
  iconBG: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: 36,
    height: 36,
  },
  title: {
    fontFamily: FONTFAMILY.poppins_bold, // Thay đổi font chữ cho tiêu đề
    fontSize: FONTSIZE.size_18,
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
  },
});
