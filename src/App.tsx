import React from "react";
import "./App.css";
import FDReturnsCalculator from "./pages/FDReturnsCalculator"; // Adjust the path if necessary
import RDReturnsCalculator from "./pages/RDReturnsCalculator"; // Adjust the path if necessary
import NSCCalculator from "./pages/NSCCalculator"; // Adjust the path if necessary
import HomeLoanCalculator from "./pages/HomeLoanCalculator"; // Adjust the path if necessary
import TaxLiabilityCalculator from "./pages/TaxLiabilityCalculator";
import MonthlySavingsCalculator from "./pages/MonthlySavingsCalculator";
import RemitanceCalculator from "./pages/RemitanceCalculator";
import GSTCalculator from "./pages/GSTCalculator";
import ReverseGSTCalculator from "./pages/ReverseGSTCalculator"

function App() {
  return (
    <div className="bg-gray-100 min-h-screen py-3">
      <ReverseGSTCalculator />
    </div>
  );
}

export default App;