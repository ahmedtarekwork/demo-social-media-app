import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container">{<Outlet />}</div>
      </main>
      <footer className="main-site-footer">
        <div className="container">this is the footer for now</div>
      </footer>
    </>
  );
};
export default MainLayout;
