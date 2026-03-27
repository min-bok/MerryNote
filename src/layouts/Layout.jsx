import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer } from "../components";

export default function Layout() {
  const location = useLocation();
  const isEditorPage = location.pathname.endsWith("/edit");

  return (
    <>
      <Header />
      <Outlet />
      {!isEditorPage && <Footer />}
    </>
  );
}
