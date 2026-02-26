import { useEffect, useRef } from "react";
import styled from "styled-components"

const CANVAS_W = 452.635;
const CANVAS_H = 638;

export default function Canvas({ canvasRef }) {

  return (
    <CanvasDom ref={canvasRef}/>
  )
}

const CanvasDom = styled.canvas`
  display: block;
  width: 452.635px;
  height: 638px;
  background-color: pink;
`
