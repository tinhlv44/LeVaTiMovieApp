// AboutScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../constants/Colors';
import Logo from '../components/Logo';

const AboutScreen = () => {
    const colors = useThemeColors(); 
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBlack }]}>
        <ScrollView style={styles.container}>
        <Text style={styles.title}>Giới Thiệu Ứng Dụng LeVaTiMovie</Text>
        <View style={{alignItems:'center', paddingVertical: 20}}>
            <Logo size={40}/>

        </View>
        <Text style={[styles.description, { color: colors.white }]}>
            Ứng dụng LeVaTiMovie cho phép bạn đặt vé xem phim một cách dễ dàng và nhanh chóng. Với giao diện thân thiện và tính năng đa dạng, người dùng có thể tìm kiếm phim, xem lịch chiếu, chọn ghế ngồi và thanh toán trực tuyến một cách thuận tiện.
        </Text>
        
        <Text style={styles.subtitle}>Tính Năng Nổi Bật:</Text>
        <Text style={[styles.feature, { color: colors.white }]}>
            • Tìm kiếm phim theo tên, thể loại và lịch chiếu{'\n'}
            • Xem thông tin chi tiết về phim, bao gồm mô tả, diễn viên và đánh giá{'\n'}
            • Chọn ghế ngồi và xem giá vé trực tiếp{'\n'}
            • Thanh toán dễ dàng qua các phương thức như VNPay, MoMo, hoặc Google Pay{'\n'}
            • Nhận thông báo về các bộ phim mới ra mắt và ưu đãi đặc biệt
        </Text>
        </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#dc3545',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'justify',
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#dc3545',
  },
  feature: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'justify',
    color: '#333',
  },
  footer: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    color: '#333',
  },
});

export default AboutScreen;
