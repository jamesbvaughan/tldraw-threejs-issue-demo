import { NextPage } from "next";
import dynamic from "next/dynamic";

const TlCanvas = dynamic(() => import("../TlCanvas"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        display: "flex",
      }}
    >
      <div
        style={{
          border: "2px solid black",
          width: "50%",
          padding: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "300px", flexShrink: "0" }}>
          <h1>Main issue</h1>

          <p>
            The problem here is that the content of the Three.js canvas is
            blurred when you zoom in on the tldraw canvas. I believe this is
            because Three.js is rendering its view at a specific resolution and
            not re-rendering at higher resolutions as you zoom.
          </p>

          <p>
            To reproduce: Zoom in with Cmd+scroll. The red wireframe shape
            should remain sharp but it does not. (You can left-click and drag to
            pan.)
          </p>
        </div>

        <TlCanvas />
      </div>

      <div
        style={{
          border: "2px solid black",
          width: "50%",
          padding: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "300px", flexShrink: "0" }}>
          <h1>Hacky attempted solution</h1>

          <p>
            This canvas implements a solution that involves manually resetting
            the height and width of the Three.js canvas as you zoom in and out
            of the tldraw canvas.
          </p>

          <p>
            The problem with this solution is that something gets reset when you
            hover or unhover the Three.js canvas after zooming. It returns to
            the low-res view, but I have not figured out why.
          </p>

          <p>
            To reproduce: Zoom in with Cmd+scroll and then hover and unhover the
            Three.js canvas (the gray region with the black border).
          </p>
        </div>

        <TlCanvas shouldUseHack={true} />
      </div>
    </div>
  );
};

export default Home;
