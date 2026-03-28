import { Routes, Route } from "react-router-dom";
import JokeOfTheDayPage from "./pages/JokeOfTheDayPage.jsx";
import JokeListPage from "./pages/JokeListPage.jsx";
import JokeDetailPage from "./pages/JokeDetailPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<JokeOfTheDayPage />} />
        <Route path="/jokes" element={<JokeListPage />} />
        <Route path="/jokes/:id" element={<JokeDetailPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
