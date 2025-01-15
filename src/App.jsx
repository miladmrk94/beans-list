import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Profile from "./pages/Profile";
import Intro from "./pages/Intro";
import NavigationBar from "./components/NavigationBar";
import React from "react";

function App({ initialShowIntro }) {
  const [showIntro, setShowIntro] = React.useState(initialShowIntro);

  const handleIntroComplete = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
  };

  return (
    <BrowserRouter basename="/beans-list">
      <Routes>
        <Route path="/intro" element={<Intro />} />
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/Profile" element={<Profile />} />
              </Routes>
              <NavigationBar />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;