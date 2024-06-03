import { useState } from "react";
import "./App.css";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("burgers");
  const [recipes, setRecipes] = useState([]); 
  return (
    <div>
      <h1>React App</h1>
    </div>
  );
};

export default App;
