import styled from "styled-components"

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
