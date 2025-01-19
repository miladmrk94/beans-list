import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Profile from "./pages/Profile";
import Intro from "./pages/Intro";
import NavigationBar from "./components/NavigationBar";
import React from "react";

function App() {
  // Check if user has seen intro
  const hasSeenIntro = localStorage.getItem('hasSeenIntro');

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to intro if first visit */}
        <Route path="/" element={
          !hasSeenIntro ? <Navigate to="/intro" replace /> : (
            <>
              <Header />
              <Home />
              <NavigationBar />
            </>
          )
        } />

        {/* Intro page */}
        <Route path="/intro" element={
          hasSeenIntro ? <Navigate to="/" replace /> : <Intro />
        } />

        {/* Other routes */}
        <Route path="/practice" element={
          !hasSeenIntro ? <Navigate to="/intro" replace /> : (
            <>
              <Header />
              <Practice />
              <NavigationBar />
            </>
          )
        } />
        
        <Route path="/profile" element={
          !hasSeenIntro ? <Navigate to="/intro" replace /> : (
            <>
              <Header />
              <Profile />
              <NavigationBar />
            </>
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;