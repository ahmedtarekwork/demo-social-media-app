import { Outlet } from "react-router-dom";

// components
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <Header />

      <main className="my-4 min-vh-100">
        <div className="container">{<Outlet />}</div>
      </main>

      <Footer />
    </>
  );
};
export default MainLayout;
