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
        <div className="container">
          made by{" "}
          <a target="_blank" href="https://github.com/ahmedtarekwork">
            Ahmed Tarek
          </a>
        </div>
      </footer>
    </>
  );
};
export default MainLayout;
