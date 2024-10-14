import React from 'react';
import { Switch } from 'react-native';
import { toggleDarkMode, useMyContextController } from '../store';

const DarkModeToggle = () => {
    const [controller, dispatch] = useMyContextController(); // Lấy controller và dispatch từ context

    // Hàm xử lý khi bật/tắt switch
    const handleToggleSwitch = () => {
        toggleDarkMode(dispatch); // Gọi hàm để thay đổi darkMode
    };

    return (
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={controller.darkMode ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={handleToggleSwitch}
                value={controller.darkMode} // Giá trị của switch phụ thuộc vào darkMode
                
            />
    );
};

export default DarkModeToggle;
