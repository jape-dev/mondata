import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Connector } from "./Screens/Connector";
import { OpenAPI } from "api";

export const RouterPath = {
  CONNECT: "/",
};

function App() {
  OpenAPI.BASE = process.env.REACT_APP_BASE_URL || "http://localhost:80";

  return (
    <>
      <Router>
        <Routes>
          <Route path={RouterPath.CONNECT} element={<Connector />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
