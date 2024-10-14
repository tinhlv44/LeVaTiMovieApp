import { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Alert } from 'react-native';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MyContext = createContext();
MyContext.displayName = 'MyAppContext';

// Define reducer
const reducer = (state, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, userLogin: action.value, uid: action.uid };
        case "LOGOUT":
            return { ...state, userLogin: null, uid: null };
        case "UPDATE_USER":
            return { ...state, userLogin: action.value };
        case "TOGGLE_DARK_MODE":
            return { ...state, darkMode: !state.darkMode };
        case "SET_DARK_MODE": // Thêm case để đặt dark mode từ AsyncStorage
            return { ...state, darkMode: action.value };
        default:
            return state;
    }
};


// Define MyContextControllerProvider
const MyContextControllerProvider = ({ children }) => {
    const initialState = {
        userLogin: null,
        uid: null,
        services: [],
        darkMode: false, 
    };

    const [controller, dispatch] = useReducer(reducer, initialState);

    // Load darkMode from AsyncStorage when the app starts
    useEffect(() => {
        const loadDarkMode = async () => {
            try {
                const storedDarkMode = await AsyncStorage.getItem('darkMode');
                if (storedDarkMode !== null) {
                    dispatch({ type: 'SET_DARK_MODE', value: JSON.parse(storedDarkMode) });
                }
            } catch (e) {
                console.log('Lỗi khi tải dark mode:', e);
            }
        };
        loadDarkMode();
    }, []);

    // Save darkMode to AsyncStorage whenever it changes
    useEffect(() => {
        const saveDarkMode = async () => {
            try {
                await AsyncStorage.setItem('darkMode', JSON.stringify(controller.darkMode));
            } catch (e) {
                console.log('Lỗi khi lưu dark mode:', e);
            }
        };
        saveDarkMode();
    }, [controller.darkMode]);

    const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

    return (
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    );
};


// Define useMyContextController
const useMyContextController = () => {
    const context = useContext(MyContext);
    if (context == null) throw new Error('useMyContextController must be inside MyContextControllerProvider');
    return context;
};

// Define actions
const login = async (dispatch, email, password) => {
    try {
        // Sign in with Firebase Auth
        const response = await signInWithEmailAndPassword(auth, email, password);
        const uid = response.user.uid; // Get user uid

        // Get document from "users" collection where email matches
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        // Check if user exists
        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            dispatch({ type: "USER_LOGIN", value: userData, uid }); // Save uid and userData
        } else {
            Alert.alert('Thông báo', 'Không tìm thấy thông tin người dùng.');
        }
    } catch (e) {
        Alert.alert('Thông báo', 'Sai email hoặc password');
        console.log("Lỗi khi đăng nhập:", e);
    }
};

const logout = async (dispatch) => {
    try {
        await signOut(auth);
        dispatch({ type: "LOGOUT" });
    } catch (e) {
        Alert.alert('Thông báo', 'Đăng xuất thất bại.');
    }
};

const toggleDarkMode = (dispatch) => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
};

export {
    MyContextControllerProvider,
    useMyContextController,
    login,
    logout,
    toggleDarkMode
};
