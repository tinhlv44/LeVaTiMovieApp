import AppNavigation  from "./navigation/appNavigation";
import { MyContextControllerProvider, useMyContextController } from "./store";

export default function App() {
  return (
    <MyContextControllerProvider>      
      <AppNavigation />
    </MyContextControllerProvider>
  );
}
