import { Box } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  HTMLContainer,
  TLBounds,
  TLComponentProps,
  TLShape,
  TLShapeUtil,
  Utils,
} from "@tldraw/core";
import { useEffect } from "react";
import useStore from "./store";

export interface ThreeJsShape extends TLShape {
  width: number;
  height: number;
}

const ThreeJsCanvasInternals = () => {
  return (
    <Box>
      <meshBasicMaterial color="red" wireframe />
    </Box>
  );
};

const ThreeJsCanvasInternalsWithHack = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const tldrawZoom = useStore((s) => s.tlPageState.camera.zoom);

  const set = useThree((s) => s.set);
  const get = useThree((s) => s.get);

  // The purpose of this effect is to manually update the Three.js camera's
  // parameters as the tldraw canvas' zoom level changes.
  useEffect(() => {
    set({
      size: {
        ...get().size,
        width: width * tldrawZoom,
        height: height * tldrawZoom,
        updateStyle: false,
      },
    });
  }, [tldrawZoom, set, get, width, height]);

  return (
    <Box>
      <meshBasicMaterial color="red" wireframe />
    </Box>
  );
};

export class ThreeJsShapeUtil extends TLShapeUtil<
  ThreeJsShape,
  HTMLImageElement
> {
  Component = TLShapeUtil.Component<ThreeJsShape, HTMLImageElement>(
    (
      {
        shape: { width, height },
        events,
        meta: { shouldUseHack },
      }: TLComponentProps<ThreeJsShape>,
      ref
    ) => {
      return (
        <HTMLContainer ref={ref} {...events}>
          <div
            style={{
              height,
              width,
              borderWidth: 2,
              backgroundColor: "gray",
              borderColor: "black",
              borderStyle: "solid",
              pointerEvents: "auto",
            }}
          >
            <Canvas>
              {shouldUseHack ? (
                <ThreeJsCanvasInternalsWithHack width={width} height={height} />
              ) : (
                <ThreeJsCanvasInternals width={width} height={height} />
              )}
            </Canvas>
          </div>
        </HTMLContainer>
      );
    }
  );

  isStateful = true;

  Indicator = TLShapeUtil.Indicator<ThreeJsShape>(({ shape }) => {
    return (
      <rect
        fill="none"
        stroke="blue"
        strokeWidth={1}
        width={shape.width}
        height={shape.height}
      />
    );
  });

  getBounds = ({ width, height, point }: ThreeJsShape): TLBounds => {
    const bounds = {
      minX: 0,
      maxX: width,
      minY: 0,
      maxY: height,
      width,
      height,
    };

    return Utils.translateBounds(bounds, point);
  };
}
