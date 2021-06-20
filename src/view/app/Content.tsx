import React from "react";
import ControlPanel from "./components/ControlPanel";
import Searchbar from "./components/Searchbar";
import SVGsGrid from "./components/SVGsGrid";

const Content = () => {
  return (
    <>
      <Searchbar />
      <div className="content">
        <SVGsGrid />
        <ControlPanel />
      </div>
    </>
  );
};

export default Content;
