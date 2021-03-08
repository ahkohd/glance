import React from "react";
import ControlPanel from "./components/ControlPanel";
import Searchbar from "./components/Searchbar";
import SVGsGrid from "./components/SVGsGrid";

const App = () => {
  return (
    <div id="App">
      <Searchbar />
      <div className="content">
        <SVGsGrid />
        <ControlPanel />
      </div>
      <p>
        Made with 💜 by <a href="https://github.com/ahkohd">@ahkohd</a>
      </p>
    </div>
  );
};

export default App;
