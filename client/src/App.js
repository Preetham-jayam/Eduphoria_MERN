import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import MainNavbar from "./shared/components/Navigation/MainNavbar";
import Footer from "./shared/components/Footer/Footer";
import AnimatedRoutes from "./components/AnimatedRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




function App() {

  return (
    <>
      <ToastContainer theme="colored" autoClose={3000} />
        <Router>
          <MainNavbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </Router>

    </>
  );
}

export default App;
