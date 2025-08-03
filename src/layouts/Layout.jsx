import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
