import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { routingArray } from "./constants/constants";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      {routingArray.map((curElem) => {
        return <Route key={curElem.forKey} exact path={curElem.path} element={curElem.element} />;
      })}
    </Routes>
  );
}

export default App;
