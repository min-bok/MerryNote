import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Layout } from "./layouts";
import { Home, Editor } from "./pages";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Navigate to="/explain" replace />} />
          <Route path="/" element={<Layout />}>
            <Route path="explain" element={<Home />} />
            <Route path="edit" element={<Editor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;
    --page-bg: #f3efe7;
    --surface: #fffdf8;
    --ink: #221b17;
    --muted: #6d6257;
    --line: rgba(34, 27, 23, 0.12);
    --accent: #c96f4a;
    --accent-deep: #7d2f18;
    --sage: #5f7f75;
    --warning: #aa3a2a;
    --warning-soft: #f8dbd6;
    --success: #2f6d52;
    --success-soft: #d8eee0;
    --shadow: 0 20px 60px rgba(57, 41, 31, 0.12);
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
    background:
      radial-gradient(circle at top left, rgba(201, 111, 74, 0.18), transparent 30%),
      linear-gradient(180deg, #f7f2eb 0%, #f1ece4 55%, #ece7df 100%);
    color: var(--ink);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }
`;

export default App;
