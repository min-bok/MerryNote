import styled from "styled-components";

export default function Menubar({activeTool, onChangeTool}) {
  console.debug("activeTool", activeTool)
  
  return (
    <MenuWrapper>
      <MenuButton $active={activeTool === "pen"} onClick={() => {onChangeTool("pen")}} type="button">펜</MenuButton>
      <MenuButton $active={activeTool === "eraser"} onClick={() => onChangeTool("eraser")} type="button">지우개</MenuButton>
    </MenuWrapper>
  )
}

const MenuWrapper = styled.div`
  padding: 10px;
  background-color: blue;
`

const MenuButton = styled.button`
  width: 50px;
  height: 50px;
  // font-size: 0;
  background-color: ${({ $active }) => ($active ? "skyblue" : "powderblue")};
  cursor: pointer;
`