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
import { useRef } from "react";
import { BufferGeometry, Camera, Group, Material, Scene, WebGLRenderer } from "three";

import useStore from "./store";

export interface ThreeJsShape extends TLShape {
  width: number;
  height: number;
}

const ThreeJsCanvasInternals = ({
  width,
  height,
}: {
  width: number;
  height: number;
  shouldUseHack: boolean;
}) => {
  const tldrawZoom = useStore((s) => s.tlPageState.camera.zoom);

  const scene = useThree((s) => s.scene);

  if (!scene.userData["custom-size"]) {
    const customSize = [0, 0];
    scene.userData["custom-size"] = customSize;
    scene.onBeforeRender = (renderer: WebGLRenderer,
      _scene: Scene,
      _camera: Camera,
      _geometry: BufferGeometry,
      _material: Material,
      _group: Group
    ) => {
      // This overwrites the setSize call from react-three-fiber, which uses a
      // CSS measurement for the canvas element, which is not what we want here.
      renderer.setSize(customSize[0], customSize[1], false);
    }
  }

  scene.userData["custom-size"][0] = width * tldrawZoom;
  scene.userData["custom-size"][1] = height * tldrawZoom;

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
