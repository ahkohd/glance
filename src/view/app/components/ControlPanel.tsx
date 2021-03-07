import React from "react";
import useStore from "../store/store";

const ControlPanel = () => {
  const [{ svgTree, query }] = useStore();

  return (
    <div>
      side bar, {query} assets{svgTree?.children?.length ?? 0}
    </div>
  );
};

export default ControlPanel;
