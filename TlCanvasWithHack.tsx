import { Renderer } from "@tldraw/core";
import useStore from "./store";

import { ThreeJsShapeUtil } from "./threeJsShape";

const shapeUtils = {
  threeJsShape: new ThreeJsShapeUtil(),
};

const TlCanvas = () => {
  const {
    tlPage,
    tlPageState,
    handleZoom,
    handleHoverShape,
    handleUnhoverShape,
    handlePan,
    handleDragCanvas,
  } = useStore();

  return (
    <Renderer
      page={tlPage}
      pageState={tlPageState}
      shapeUtils={shapeUtils}
      onPan={handlePan}
      onDragCanvas={handleDragCanvas}
      onZoom={handleZoom}
      onHoverShape={handleHoverShape}
      onUnhoverShape={handleUnhoverShape}
    />
  );
};

export default TlCanvas;
