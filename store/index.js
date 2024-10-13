import { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Alert } from 'react-native';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const MyContext = createContext();
MyContext.displayName = 'MyAppContext';

// Define reducer
const reducer = (state, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, userLogin: action.value, uid: action.uid }; // Save uid on login
        case "LOGOUT":
            return { ...state, userLogin: null, uid: null }; // Clear uid on logout
        case "UPDATE_USER": // New case to update user data
            return { ...state, userLogin: action.value }; // Update user data
        default:
            return state;
    }
};

// Define MyContextControllerProvider
const MyContextControllerProvider = ({ children }) => {
    // Initialize state
    const initialState = {
        userLogin: null,
        uid: null,
        services: [],
    };
    const [controller, dispatch] = useReducer(reducer, initialState);

    // Listen for changes to user data
    useEffect(() => {
        if (controller.uid) {
            const q = query(collection(db, "users"), where("uid", "==", controller.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    dispatch({ type: "UPDATE_USER", value: userData }); // Update user data on change
                }
            });

            // Cleanup listener on unmount
            return () => unsubscribe();
        }
    }, [controller.uid]);

    // UseMemo for performance optimization
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

export {
    MyContextControllerProvider,
    useMyContextController,
    login,
    logout
};
