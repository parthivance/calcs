import React from "react";
import "./App.css";
import FDReturnsCalculator from "./pages/FDReturnsCalculator"; // Adjust the path if necessary
import RDReturnsCalculator from "./pages/RDReturnsCalculator"; // Adjust the path if necessary
import NSCCalculator from "./pages/NSCCalculator"; // Adjust the path if necessary
import HomeLoanCalculator from "./pages/HomeLoanCalculator"; // Adjust the path if necessary
import { Home } from "lucide-react";


function App() {
  return (
    <div className="bg-gray-100 min-h-screen py-3">
      <HomeLoanCalculator />
    </div>
  );
}

export default App;