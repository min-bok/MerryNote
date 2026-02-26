import Canvas from "../features/editor/Canvas"
import Menubar from "../components/editor/Menubar"
import { useEffect, useRef, useState } from "react"
import { handlePen } from "../features/editor/Pen";

const CANVAS_W = 452.635;
const CANVAS_H = 638;

export default function Editor() {
  const canvasRef = useRef(null);
  const toolRef = useRef(null);
  const [tool, setTool] = useState("pen");
  
  function resizeToCssSize({ cssWidth, cssHeight, dpr = window.devicePixelRatio || 1 }) {
    const canvas = canvasRef.current;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
  }

  useEffect(() => {
    resizeToCssSize({cssWidth: CANVAS_W, cssHeight: CANVAS_H});
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return;
    toolRef.current?.detach();

    if (tool === "pen") {
      toolRef.current = handlePen(canvasRef.current);
    }

    // if (tool === "eraser") {
    //   toolRef.current = handleEraser(canvasRef.current);
    // }

    return () => {
      toolRef.current?.detach();
    };
  }, [tool]);

  return (
    <>
      <div>Editor</div>
      <Canvas canvasRef={canvasRef}/>
      <Menubar activeTool={tool} onChangeTool={setTool}/>
    </>
  )
}