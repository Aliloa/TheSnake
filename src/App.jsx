import Board from "./components/Board/Board";
import Toggle from "./components/Toggle/Toggle";
import { useDropzone } from "react-dropzone";
import useStore from "./utils/store";

function App() {
    document.title = 'The Bindings Of The Snake';

  const { skin, setSkin } = useStore();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg": [],
      "image/webp": [],
      "image/gif": [],
    },
    maxFiles: 1,
    noClick: true,
    onDrop: (file) => onDrop(file),
  });

  const onDrop = (file) => {
    const src = URL.createObjectURL(file[0]);
    setSkin(src);
  };

  return (
    <div>
      {/* <video src="/you-died.mp4" id="die-video" className="die-video"></video> */}
      <div style={{ backgroundImage: 'url(/gameoverbg.png)' }} id="die-video" className="die-video" />
      <video
        src="/nether.mp4"
        id="nether-video"
        className="nether-video"
        autoPlay
        loop
        muted
      ></video>

      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {skin && <img src={skin} alt="" />}
      </div>

      <div className="flashbang"></div>

      <div className="speedup"><p>Speed UP</p></div>
      <div className="speedown"><p>Speed DOWN</p></div>
      <div className="paralysis"><p>Paralysis</p></div>
      <div className="diharrea"><p>Explosive Diharrea</p></div>

      <Board />
      <div className="toggle-wrapper">
        <Toggle mode={"corner"} />
        <Toggle mode={"reversed"} />
      </div>
    </div>
  );
}

export default App;
