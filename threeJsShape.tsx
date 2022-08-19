import { Box } from "@react-three/drei";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  HTMLContainer,
  TLBounds,
  TLComponentProps,
  TLShape,
  TLShapeUtil,
  Utils,
} from "@tldraw/core";
import { useLayoutEffect } from "react";
import useStore from "./store";

export interface ThreeJsShape extends TLShape {
  width: number;
  height: number;
}

const ThreeJsCanvasInternals = ({width, height}: {width: number, height: number}) => {
  const tldrawZoom = useStore(s => s.tlPageState.camera.zoom)

  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const set = useThree((s) => s.set);
  const get = useThree((s) => s.get);

  useLayoutEffect(() => {
    if (!camera) return;

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = size.width / size.height;
    } else if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -size.width / 2 / tldrawZoom;
      camera.right = size.width / 2 / tldrawZoom;
      camera.top = size.height / 2 / tldrawZoom;
      camera.bottom = -size.height / 2 / tldrawZoom;
    }

    camera.updateProjectionMatrix();
  }, [camera, size, tldrawZoom]);

  useLayoutEffect(() => {
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
      <meshBasicMaterial color="green" wireframe />
    </Box>
  );
};

export class ThreeJsShapeUtil extends TLShapeUtil<
  ThreeJsShape,
  HTMLImageElement
> {
  Component = TLShapeUtil.Component<ThreeJsShape, HTMLImageElement>(
    (
      { shape: { width, height }, events }: TLComponentProps<ThreeJsShape>,
      ref
    ) => {
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
            <Canvas>
              <ThreeJsCanvasInternals width={width} height={height} />
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
