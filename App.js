import { StatusBar } from "expo-status-bar";
import AppNavigation  from "./navigation/appNavigation";
import { MyContextControllerProvider, useMyContextController } from "./store";
import { Colors } from "./constants/Colors";

export default function App() {
  return (
    <MyContextControllerProvider>
      
      <StatusBar style="light" backgroundColor={Colors.bgBlack} />
      <AppNavigation />

    </MyContextControllerProvider>
  );
}
