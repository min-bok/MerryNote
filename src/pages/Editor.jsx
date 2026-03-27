import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

const FRAME_WIDTH = 720;
const FRAME_HEIGHT = 1020;
const BLEED = 35;
const SAFE = 70;

const initialElements = [
  {
    id: "title",
    type: "text",
    name: "Couple names",
    content: "MINHO & SUJI",
    x: 126,
    y: 180,
    width: 468,
    height: 72,
    fontSize: 44,
    critical: true,
    color: "#35251f",
    align: "center",
  },
  {
    id: "date",
    type: "text",
    name: "Wedding date",
    content: "2026. 10. 17 SAT 12:30 PM",
    x: 166,
    y: 268,
    width: 388,
    height: 38,
    fontSize: 21,
    critical: true,
    color: "#7d2f18",
    align: "center",
  },
  {
    id: "photo",
    type: "image",
    name: "Couple photo",
    x: 170,
    y: 364,
    width: 380,
    height: 396,
    critical: true,
    imageUrl: "",
    fill: "linear-gradient(160deg, #ead8c8, #d7b296)",
  },
  {
    id: "ornament",
    type: "shape",
    name: "Decorative line",
    x: 206,
    y: 810,
    width: 308,
    height: 3,
    critical: false,
    fill: "#d5ab92",
  },
];

const toolDefinitions = [
  { id: "select", label: "Select" },
  { id: "draw", label: "Draw" },
];

const addableItems = [
  { id: "title", label: "Name text", type: "text", critical: true },
  { id: "info", label: "Guide text", type: "text", critical: true },
  { id: "photo", label: "Photo block", type: "image", critical: true },
  { id: "ornament", label: "Decor shape", type: "shape", critical: false },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isWithin(rect, boundary) {
  return (
    rect.x >= boundary.x &&
    rect.y >= boundary.y &&
    rect.x + rect.width <= boundary.x + boundary.width &&
    rect.y + rect.height <= boundary.y + boundary.height
  );
}

function intersects(rect, boundary) {
  return !(
    rect.x + rect.width <= boundary.x ||
    rect.x >= boundary.x + boundary.width ||
    rect.y + rect.height <= boundary.y ||
    rect.y >= boundary.y + boundary.height
  );
}

export default function Editor() {
  const frameRef = useRef(null);
  const dragState = useRef(null);
  const drawState = useRef(null);

  const [tool, setTool] = useState("select");
  const [elements, setElements] = useState(initialElements);
  const [selectedId, setSelectedId] = useState("title");
  const [strokes, setStrokes] = useState([]);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  const selectedElement = elements.find((element) => element.id === selectedId) ?? null;

  const boundaries = useMemo(
    () => ({
      trim: {
        x: BLEED,
        y: BLEED,
        width: FRAME_WIDTH - BLEED * 2,
        height: FRAME_HEIGHT - BLEED * 2,
      },
      safe: {
        x: BLEED + SAFE,
        y: BLEED + SAFE,
        width: FRAME_WIDTH - (BLEED + SAFE) * 2,
        height: FRAME_HEIGHT - (BLEED + SAFE) * 2,
      },
    }),
    []
  );

  const warnings = useMemo(() => {
    return elements.flatMap((element) => {
      const rect = { x: element.x, y: element.y, width: element.width, height: element.height };
      const issues = [];

      if (element.critical && !isWithin(rect, boundaries.safe)) {
        issues.push({
          level: "high",
          targetId: element.id,
          message: `${element.name} is outside the safe zone and may be trimmed.`,
        });
      }

      if (
        element.critical &&
        intersects(rect, boundaries.trim) &&
        !isWithin(rect, boundaries.trim)
      ) {
        issues.push({
          level: "high",
          targetId: element.id,
          message: `${element.name} overlaps the bleed area and can be cut in print.`,
        });
      }

      return issues;
    });
  }, [boundaries.safe, boundaries.trim, elements]);

  useEffect(() => {
    function handlePointerMove(event) {
      if (dragState.current) {
        const { id, offsetX, offsetY } = dragState.current;
        const nextX = clamp(event.clientX - offsetX, 0, FRAME_WIDTH - 40);
        const nextY = clamp(event.clientY - offsetY, 0, FRAME_HEIGHT - 24);

        setElements((current) =>
          current.map((element) =>
            element.id === id
              ? {
                  ...element,
                  x: clamp(nextX, 0, FRAME_WIDTH - element.width),
                  y: clamp(nextY, 0, FRAME_HEIGHT - element.height),
                }
              : element
          )
        );
      }

      if (drawState.current && frameRef.current) {
        const rect = frameRef.current.getBoundingClientRect();
        const x = clamp(event.clientX - rect.left, 0, FRAME_WIDTH);
        const y = clamp(event.clientY - rect.top, 0, FRAME_HEIGHT);
        const nextPoint = `${Math.round(x)},${Math.round(y)}`;

        setStrokes((current) =>
          current.map((stroke) =>
            stroke.id === drawState.current.id
              ? { ...stroke, points: [...stroke.points, nextPoint] }
              : stroke
          )
        );
      }
    }

    function handlePointerUp() {
      dragState.current = null;
      drawState.current = null;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function addElement(kind) {
    const baseId = `${kind.type}-${Date.now()}`;
    const nextElement =
      kind.type === "text"
        ? {
            id: baseId,
            type: "text",
            name: kind.label,
            content: kind.id === "title" ? "Type your title here" : "Add date, venue, contact, or QR guide here",
            x: 120,
            y: 120 + elements.length * 24,
            width: 480,
            height: kind.id === "title" ? 62 : 96,
            fontSize: kind.id === "title" ? 36 : 19,
            critical: kind.critical,
            color: "#35251f",
            align: kind.id === "title" ? "center" : "left",
          }
        : kind.type === "image"
        ? {
            id: baseId,
            type: "image",
            name: kind.label,
            x: 170,
            y: 300,
            width: 380,
            height: 280,
            critical: kind.critical,
            imageUrl: "",
            fill: "linear-gradient(150deg, #eadccb, #c6a186)",
          }
        : {
            id: baseId,
            type: "shape",
            name: kind.label,
            x: 160,
            y: 820,
            width: 400,
            height: 12,
            critical: kind.critical,
            fill: "#dfc4b5",
          };

    setElements((current) => [...current, nextElement]);
    setSelectedId(baseId);
  }

  function updateSelected(updater) {
    if (!selectedElement) return;

    setElements((current) =>
      current.map((element) =>
        element.id === selectedElement.id ? { ...element, ...updater } : element
      )
    );
  }

  function handleElementPointerDown(event, id) {
    if (tool !== "select" || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const target = elements.find((element) => element.id === id);
    setSelectedId(id);
    dragState.current = {
      id,
      offsetX: event.clientX - rect.left - (target?.x ?? 0),
      offsetY: event.clientY - rect.top - (target?.y ?? 0),
    };
  }

  function handleFramePointerDown(event) {
    if (tool !== "draw" || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, FRAME_WIDTH);
    const y = clamp(event.clientY - rect.top, 0, FRAME_HEIGHT);
    const id = `stroke-${Date.now()}`;
    drawState.current = { id };
    setSelectedId(null);
    setStrokes((current) => [...current, { id, points: [`${Math.round(x)},${Math.round(y)}`] }]);
  }

  function handleImageUpload(event) {
    if (!selectedElement || selectedElement.type !== "image") return;
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateSelected({ imageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <Page>
      <Sidebar>
        <Panel>
          <PanelTitle>Tools</PanelTitle>
          <ToolRow>
            {toolDefinitions.map((item) => (
              <ToolButton
                key={item.id}
                type="button"
                $active={tool === item.id}
                onClick={() => setTool(item.id)}
              >
                {item.label}
              </ToolButton>
            ))}
          </ToolRow>
        </Panel>

        <Panel>
          <PanelTitle>Add elements</PanelTitle>
          <AddList>
            {addableItems.map((item) => (
              <AddButton key={item.id} type="button" onClick={() => addElement(item)}>
                <strong>{item.label}</strong>
                <span>
                  {item.critical
                    ? "Keep this inside the safe zone."
                    : "Decorative elements can extend into the bleed."}
                </span>
              </AddButton>
            ))}
          </AddList>
        </Panel>

        <Panel>
          <PanelTitle>Print rules</PanelTitle>
          <HintList>
            <li>Use the 35px bleed for backgrounds, textures, gradients, and patterns.</li>
            <li>Keep names, date, venue, contact, QR, logo, and faces inside the safe zone.</li>
            <li>If a critical element touches bleed or exits safe zone, the editor warns immediately.</li>
          </HintList>
        </Panel>
      </Sidebar>

      <Workspace>
        <WorkspaceTop>
          <div>
            <h1>Invitation editor</h1>
            <p>Three-panel layout inspired by Figma and Canva.</p>
          </div>
          <InspectorToggle type="button" onClick={() => setInspectorOpen((current) => !current)}>
            {inspectorOpen ? "Hide inspector" : "Show inspector"}
          </InspectorToggle>
        </WorkspaceTop>

        <CanvasShell>
          <ZoomHint>Bleed and safe-zone guides stay visible on top of the frame while editing.</ZoomHint>
          <FrameWrap>
            <Frame ref={frameRef} onPointerDown={handleFramePointerDown} $drawMode={tool === "draw"}>
              <BleedLabel style={{ top: 10, left: 12 }}>Bleed 35px</BleedLabel>
              <SafeLabel style={{ top: BLEED + SAFE + 8, right: BLEED + SAFE + 12 }}>
                Safe Zone
              </SafeLabel>
              <TrimArea />
              <SafeArea />

              {elements.map((element) => {
                const hasWarning = warnings.some((warning) => warning.targetId === element.id);
                return (
                  <ElementCard
                    key={element.id}
                    type="button"
                    onPointerDown={(event) => handleElementPointerDown(event, element.id)}
                    onClick={() => setSelectedId(element.id)}
                    $selected={selectedId === element.id}
                    $critical={element.critical}
                    $warning={hasWarning}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      color: element.color,
                      textAlign: element.align,
                    }}
                  >
                    {element.type === "text" && (
                      <TextPreview style={{ fontSize: element.fontSize, textAlign: element.align }}>
                        {element.content}
                      </TextPreview>
                    )}
                    {element.type === "image" && (
                      <ImagePreview
                        style={
                          element.imageUrl
                            ? {
                                backgroundImage: `url(${element.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }
                            : { background: element.fill }
                        }
                      >
                        {!element.imageUrl && (
                          <>
                            <span>IMAGE</span>
                            <small>Upload or replace in inspector</small>
                          </>
                        )}
                      </ImagePreview>
                    )}
                    {element.type === "shape" && <ShapePreview style={{ background: element.fill }} />}
                  </ElementCard>
                );
              })}

              <DrawingLayer viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}>
                {strokes.map((stroke) => (
                  <polyline
                    key={stroke.id}
                    fill="none"
                    stroke="#9b4b32"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={stroke.points.join(" ")}
                  />
                ))}
              </DrawingLayer>
            </Frame>
          </FrameWrap>
        </CanvasShell>
      </Workspace>

      {inspectorOpen && (
        <Inspector>
          <Panel>
            <PanelTitle>Warnings</PanelTitle>
            {warnings.length === 0 ? (
              <StatusCard $tone="safe">No critical elements are currently in a risky print area.</StatusCard>
            ) : (
              <WarningList>
                {warnings.map((warning, index) => (
                  <StatusCard
                    key={`${warning.targetId}-${index}`}
                    $tone={warning.level === "high" ? "danger" : "caution"}
                  >
                    {warning.message}
                  </StatusCard>
                ))}
              </WarningList>
            )}
          </Panel>

          <Panel>
            <PanelTitle>Selected element</PanelTitle>
            {selectedElement ? (
              <InspectorForm>
                <label>
                  Name
                  <input
                    value={selectedElement.name}
                    onChange={(event) => updateSelected({ name: event.target.value })}
                  />
                </label>

                {selectedElement.type === "text" && (
                  <>
                    <label>
                      Content
                      <textarea
                        rows="4"
                        value={selectedElement.content}
                        onChange={(event) => updateSelected({ content: event.target.value })}
                      />
                    </label>
                    <label>
                      Font size
                      <input
                        type="range"
                        min="14"
                        max="72"
                        value={selectedElement.fontSize}
                        onChange={(event) => updateSelected({ fontSize: Number(event.target.value) })}
                      />
                    </label>
                  </>
                )}

                {selectedElement.type === "image" && (
                  <label>
                    Upload image
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}

                <label>
                  Safety role
                  <select
                    value={selectedElement.critical ? "critical" : "decorative"}
                    onChange={(event) => updateSelected({ critical: event.target.value === "critical" })}
                  >
                    <option value="critical">Critical element</option>
                    <option value="decorative">Decorative element</option>
                  </select>
                </label>

                <PositionText>
                  Position {Math.round(selectedElement.x)} / {Math.round(selectedElement.y)} | Size{" "}
                  {Math.round(selectedElement.width)} x {Math.round(selectedElement.height)}
                </PositionText>
              </InspectorForm>
            ) : (
              <EmptyState>Select an element in the frame or switch to Draw mode and sketch.</EmptyState>
            )}
          </Panel>
        </Inspector>
      )}
    </Page>
  );
}

const Page = styled.main`
  min-height: calc(100vh - 90px);
  padding: 18px;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 320px;
  gap: 16px;

  @media (max-width: 1280px) {
    grid-template-columns: 260px minmax(0, 1fr);
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  display: grid;
  gap: 16px;
  align-content: start;
`;

const Panel = styled.section`
  padding: 18px;
  border-radius: 26px;
  background: rgba(255, 253, 248, 0.84);
  border: 1px solid var(--line);
  box-shadow: 0 12px 30px rgba(57, 41, 31, 0.08);
`;

const PanelTitle = styled.h2`
  margin: 0 0 14px;
  font-size: 1rem;
`;

const ToolRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const ToolButton = styled.button`
  padding: 13px 14px;
  border-radius: 16px;
  border: 1px solid ${({ $active }) => ($active ? "transparent" : "var(--line)")};
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #c96f4a, #8c4228)" : "white"};
  color: ${({ $active }) => ($active ? "#fff" : "var(--ink)")};
  font-weight: 700;
  cursor: pointer;
`;

const AddList = styled.div`
  display: grid;
  gap: 10px;
`;

const AddButton = styled.button`
  padding: 15px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: white;
  text-align: left;
  cursor: pointer;

  strong {
    display: block;
    margin-bottom: 6px;
  }

  span {
    color: var(--muted);
    font-size: 0.92rem;
    line-height: 1.5;
  }
`;

const HintList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.7;
`;

const Workspace = styled.section`
  display: grid;
  gap: 14px;
  min-width: 0;
`;

const WorkspaceTop = styled.div`
  padding: 18px 22px;
  border-radius: 26px;
  background: rgba(255, 253, 248, 0.75);
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  h1 {
    margin: 0 0 6px;
    font-size: 1.4rem;
  }

  p {
    margin: 0;
    color: var(--muted);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InspectorToggle = styled.button`
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: white;
  font-weight: 700;
  cursor: pointer;
`;

const CanvasShell = styled.div`
  min-height: 760px;
  padding: 22px;
  border-radius: 30px;
  border: 1px solid var(--line);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.48), rgba(255,255,255,0.22)),
    linear-gradient(180deg, #ddd5cc, #c9c0b5);
  display: grid;
  gap: 14px;
`;

const ZoomHint = styled.div`
  color: #4e433c;
  font-size: 0.95rem;
`;

const FrameWrap = styled.div`
  min-width: 0;
  overflow: auto;
  display: grid;
  place-items: center;
`;

const Frame = styled.div`
  position: relative;
  width: ${FRAME_WIDTH}px;
  height: ${FRAME_HEIGHT}px;
  border-radius: 28px;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(255,255,255,0.78), transparent 34%),
    linear-gradient(180deg, #fbf3ed, #f3dfd0 40%, #f8f1ea 100%);
  box-shadow: 0 28px 70px rgba(39, 29, 22, 0.25);
  cursor: ${({ $drawMode }) => ($drawMode ? "crosshair" : "default")};
`;

const TrimArea = styled.div`
  position: absolute;
  inset: ${BLEED}px;
  border: 1px dashed rgba(170, 58, 42, 0.8);
  border-radius: 16px;
  box-shadow: 0 0 0 999px rgba(198, 77, 59, 0.08);
  pointer-events: none;
`;

const SafeArea = styled.div`
  position: absolute;
  inset: ${BLEED + SAFE}px;
  border: 1px dashed rgba(47, 109, 82, 0.95);
  border-radius: 12px;
  background: rgba(216, 238, 224, 0.08);
  pointer-events: none;
`;

const ZoneLabel = styled.span`
  position: absolute;
  z-index: 3;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  pointer-events: none;
`;

const BleedLabel = styled(ZoneLabel)`
  background: rgba(248, 219, 214, 0.92);
  color: var(--warning);
`;

const SafeLabel = styled(ZoneLabel)`
  background: rgba(216, 238, 224, 0.92);
  color: var(--success);
`;

const ElementCard = styled.button`
  position: absolute;
  z-index: 2;
  display: grid;
  padding: 0;
  border-radius: 18px;
  border: 1px solid
    ${({ $selected, $warning, $critical }) =>
      $selected
        ? "#8c4228"
        : $warning
        ? "#aa3a2a"
        : $critical
        ? "rgba(125, 47, 24, 0.28)"
        : "rgba(34, 27, 23, 0.12)"};
  background: ${({ $selected }) => ($selected ? "rgba(255,255,255,0.34)" : "transparent")};
  box-shadow: ${({ $selected }) => ($selected ? "0 0 0 3px rgba(201,111,74,0.18)" : "none")};
  cursor: grab;
`;

const TextPreview = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 10px 14px;
  line-height: 1.22;
  font-family: Georgia, "Times New Roman", serif;
  letter-spacing: 0.03em;
  white-space: pre-wrap;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: rgba(53, 37, 31, 0.74);
  text-align: center;

  span {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: 0.18em;
  }

  small {
    display: block;
    margin-top: 8px;
    font-size: 0.84rem;
  }
`;

const ShapePreview = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 999px;
`;

const DrawingLayer = styled.svg`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
`;

const Inspector = styled.aside`
  display: grid;
  gap: 16px;
  align-content: start;

  @media (max-width: 1280px) {
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const WarningList = styled.div`
  display: grid;
  gap: 10px;
`;

const StatusCard = styled.div`
  padding: 14px 15px;
  border-radius: 18px;
  line-height: 1.55;
  background: ${({ $tone }) =>
    $tone === "danger"
      ? "var(--warning-soft)"
      : $tone === "caution"
      ? "rgba(250, 233, 199, 0.92)"
      : "var(--success-soft)"};
  color: ${({ $tone }) =>
    $tone === "danger" ? "var(--warning)" : $tone === "caution" ? "#8a5c09" : "var(--success)"};
  border: 1px solid
    ${({ $tone }) =>
      $tone === "danger"
        ? "rgba(170, 58, 42, 0.16)"
        : $tone === "caution"
        ? "rgba(138, 92, 9, 0.14)"
        : "rgba(47, 109, 82, 0.14)"};
`;

const InspectorForm = styled.div`
  display: grid;
  gap: 14px;

  label {
    display: grid;
    gap: 8px;
    font-size: 0.94rem;
    color: var(--muted);
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 12px 14px;
    border-radius: 14px;
    border: 1px solid var(--line);
    background: white;
  }

  textarea {
    resize: vertical;
  }
`;

const PositionText = styled.div`
  color: var(--muted);
  font-size: 0.92rem;
`;

const EmptyState = styled.div`
  color: var(--muted);
  line-height: 1.6;
`;
