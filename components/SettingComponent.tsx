import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../constants/theme";
import CustomIcon from "./CustomIcon";

const SettingComponent = (props: any) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props?.onPress} activeOpacity={0.7}>
      <View>
        <CustomIcon name={props.icon} style={styles.iconStyle} type={props.type} />
      </View>
      <View style={styles.settingContainer}>
        <Text style={styles.title}>{props.heading}</Text>
        <Text style={styles.subtitle}>{props.subheading}</Text>
        <Text style={styles.subtitle}>{props.subtitle}</Text>
      </View>
      <View style={styles.iconBG}>
        <CustomIcon
          name={"arrow-right"}
          style={styles.arrowIcon}
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
    backgroundColor: '#181818', // Thay đổi màu nền để nổi bật hơn
    borderRadius: 8,
    marginVertical: SPACING.space_10,
    elevation: 2, // Thêm bóng cho hiệu ứng nổi
  },
  settingContainer: {
    flex: 1,
    marginLeft: SPACING.space_12, // Thêm khoảng cách giữa icon và text
  },
  iconStyle: {
    color: COLORS.White, // Thay đổi màu cho icon chính
    fontSize: FONTSIZE.size_24,
  },
  arrowIcon: {
    color: COLORS.WhiteRGBA32, // Thay đổi màu cho icon mũi tên
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
    color: COLORS.White,
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.WhiteRGBA15,
  },
});
