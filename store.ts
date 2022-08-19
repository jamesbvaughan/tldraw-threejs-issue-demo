import {
  TLPage,
  TLPageState,
  TLPointerEventHandler,
  TLPointerInfo,
  TLWheelEventHandler,
  Utils,
} from "@tldraw/core";
import Vec from "@tldraw/vec";
import create from "zustand";
import { ThreeJsShape } from "./threeJsShape";

interface Store {
  tlPage: TLPage<ThreeJsShape>;
  tlPageState: TLPageState;
  pan: (pointerInfo: TLPointerInfo, invert?: boolean) => void;
  handlePan: TLWheelEventHandler;
  handleDragCanvas: TLPointerEventHandler;
  handleZoom: TLWheelEventHandler;
  handleHoverShape: TLPointerEventHandler;
  handleUnhoverShape: TLPointerEventHandler;
}

const useStore = create<Store>((set, get) => ({
  tlPage: {
    id: "page",
    shapes: {
      threeJsShape1: {
        id: "threeJsShape1",
        type: "threeJsShape",
        parentId: "page",
        childIndex: 0,
        name: "threeJsShape1",
        point: [30, 40],
        height: 100,
        width: 120,
      },
    },
    bindings: {},
  },

  tlPageState: {
    id: "page",
    selectedIds: [],
    camera: {
      point: [0, 0],
      zoom: 1,
    },
  },

  pan: (pointerInfo, invert = false) => {
    const { camera } = get().tlPageState;
    const { point, zoom } = camera;

    const zoomedDelta = Vec.div(pointerInfo.delta, zoom);
    const newPoint = Vec.sub(
      point,
      invert ? Vec.neg(zoomedDelta) : zoomedDelta
    );

    set({
      tlPageState: {
        ...get().tlPageState,
        camera: {
          ...get().tlPageState.camera,
          point: newPoint,
        },
      },
    });
  },

  handlePan: (pointerInfo) => {
    get().pan(pointerInfo);
  },

  handleDragCanvas: (pointerInfo) => {
    get().pan(pointerInfo, true);
  },

  handleZoom: (pointerInfo) => {
    const { zoom, point } = get().tlPageState.camera;

    const minimumZoomLevel = 0.5;
    const maximumZoomLevel = 10;

    const zoomBy = Utils.throttle((delta: number, center: number[]) => {
      const nextZoom = Utils.clamp(
        zoom - delta * zoom,
        minimumZoomLevel,
        maximumZoomLevel
      );

      const p0 = Vec.sub(Vec.div(center, zoom), point);
      const p1 = Vec.sub(Vec.div(center, nextZoom), point);

      const nextPoint = Vec.toFixed(Vec.add(point, Vec.sub(p1, p0)));

      return [nextZoom, nextPoint] as [number, number[]];
    }, 16);

    const delta = pointerInfo.delta[2] / 50;

    const [nextZoom, nextPoint] = zoomBy(delta, pointerInfo.point);

    set({
      tlPageState: {
        ...get().tlPageState,
        camera: {
          point: nextPoint,
          zoom: nextZoom,
        },
      },
    });
  },

  handleHoverShape: (pointerInfo) => {
    set({
      tlPageState: {
        ...get().tlPageState,
        hoveredId: pointerInfo.target,
      },
    });
  },

  handleUnhoverShape: () => {
    set({
      tlPageState: {
        ...get().tlPageState,
        hoveredId: null,
      },
    });
  },
}));

export default useStore;
