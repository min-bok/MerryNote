import { BrowserRouter, Routes, Route, Switch, Link } from "react-router-dom";
import { Layout } from "./layouts";
import { Home, Editor } from "./pages";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/editor" element={<Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
