import { useRoute } from "./useRoute";
import HomePage from "./pages/HomePage";
import Option1Page from "./pages/Option1Page";
import Option2Page from "./pages/Option2Page";
import Option3Page from "./pages/Option3Page";
import Option4Page from "./pages/Option4Page";

export default function App() {
  const [path, navigate] = useRoute();

  if (path === "/option-1") {
    return <Option1Page onBack={() => navigate("/")} />;
  }

  if (path === "/option-2") {
    return <Option2Page onBack={() => navigate("/")} />;
  }

  if (path === "/option-3") {
    return <Option3Page onBack={() => navigate("/")} />;
  }

  if (path === "/option-4") {
    return <Option4Page onBack={() => navigate("/")} />;
  }

  return (
    <HomePage
      onOpenOption1={() => navigate("/option-1")}
      onOpenOption2={() => navigate("/option-2")}
      onOpenOption3={() => navigate("/option-3")}
      onOpenOption4={() => navigate("/option-4")}
    />
  );
}
