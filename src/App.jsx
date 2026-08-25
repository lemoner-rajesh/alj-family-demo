import HomePage from "./pages/HomePage";
import VideoOptionPage from "./pages/VideoOptionPage";
import WeddingOption1Page from "./pages/WeddingOption1Page";
import WeddingOption2Page from "./pages/WeddingOption2Page";
import { useRoute } from "./useRoute";

export default function App() {
  const path = useRoute();

  if (path === "/video-option") return <VideoOptionPage />;
  if (path === "/marriage-option-1") return <WeddingOption1Page />;
  if (path === "/marriage-option-2") return <WeddingOption2Page />;
  return <HomePage />;
}
