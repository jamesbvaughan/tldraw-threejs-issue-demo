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
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";

import useStore from "./store";

export interface ThreeJsShape extends TLShape {
  width: number;
  height: number;
}

const ThreeJsCanvasInternals = ({
  width,
  height,
  shouldUseHack,
}: {
  width: number;
  height: number;
  shouldUseHack: boolean;
}) => {
  const tldrawZoom = useStore((s) => s.tlPageState.camera.zoom);

  const set = useThree((s) => s.set);
  const get = useThree((s) => s.get);
  const scene = useThree((s) => s.scene);

  // The purpose of this effect is to manually update the Three.js camera's
  // parameters as the tldraw canvas' zoom level changes.
  useLayoutEffect(() => {
    if (!shouldUseHack) return;

    set({
      size: {
        ...get().size,
        width: width * tldrawZoom,
        height: height * tldrawZoom,
        updateStyle: false,
      },
    });
  }, [shouldUseHack, tldrawZoom, set, get, width, height]);

  useEffect(() => {
    scene.background = new THREE.Color("white");
  }, [scene]);

  if (shouldUseHack) console.log("zoom", tldrawZoom)

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
      const canvasRef = useRef<HTMLCanvasElement>(null)

      return (
        <HTMLContainer ref={ref} {...events}>
          <div
            style={{
              height,
              width,
              borderWidth: 2,
              borderColor: "black",
              borderStyle: "solid",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{ height: "100%", width: "100%", position: "relative" }}
            >
              <div style={{ height: "100%", width: "100%" }}>
                <Canvas color="green" ref={canvasRef}>
                  <ThreeJsCanvasInternals
                    width={width}
                    height={height}
                    shouldUseHack={shouldUseHack}
                  />
                </Canvas>
              </div>
            </div>
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
