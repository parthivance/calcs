import React from "react";
import "./App.css";
import FDReturnsCalculator from "./pages/FDReturnsCalculator"; // Adjust the path if necessary
import RDReturnsCalculator from "./pages/RDReturnsCalculator"; // Adjust the path if necessary

function App() {
  return (
    <div className="bg-gray-100 min-h-screen py-3">
      <RDReturnsCalculator />
    </div>
  );
}

export default App;