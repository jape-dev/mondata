import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Connector } from "./Screens/Connector";
import { PublicJson } from "Screens/PublicJson";
import { OpenAPI } from "api";
import { SanitizeProvider } from "./Context/SanitizeContext";

export const RouterPath = {
  CONNECT: "/",
  PUBLIC_JSON: "/public_json",
};

function App() {
  OpenAPI.BASE = process.env.REACT_APP_DOMAIN_URL || "http://localhost:80";

  return (
    <>
      <SanitizeProvider>
        <Router>
          <Routes>
            <Route path={RouterPath.CONNECT} element={<Connector />} />
            <Route path={RouterPath.PUBLIC_JSON} element={<PublicJson />} />
          </Routes>
        </Router>
      </SanitizeProvider>
    </>
  );
}

export default App;
