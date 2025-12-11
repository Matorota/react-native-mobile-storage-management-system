import { AuthProvider } from "./context/AuthContext";
import BottomTabs from "./navigation/BottomTabs";
export default function App() {
  return (
    <AuthProvider>
      <BottomTabs />
    </AuthProvider>
  );
}
