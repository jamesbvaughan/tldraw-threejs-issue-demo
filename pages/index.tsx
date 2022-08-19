import { NextPage } from "next";
import dynamic from "next/dynamic";

const TlCanvas = dynamic(() => import("../TlCanvas"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div style={{ height: "100%", width: "100%", position: "absolute" }}>
      <p
        style={{
          position: "absolute",
          zIndex: 300,
          background: "white",
          marginLeft: 10,
        }}
      >
        To reproduce: Zoom in with Cmd+scroll and then hover and unhover the
        Three.js canvas (the region with the black border).
      </p>
      <TlCanvas />
    </div>
  );
};

export default Home;
