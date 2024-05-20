// react-router-dom
import {
  Link,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// layout
import MainLayout from "../layouts/MainLayout";

// pages
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/profilePage/ProfilePage";
import SinglePostPage from "../pages/singlePostPage/SinglePostPage";

const useAppRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<MainLayout />}>
        {!navigator.onLine ? (
          <Route
            path="*"
            element={
              <h2 style={{ textAlign: "center" }}>No Internet Connection!</h2>
            }
          />
        ) : (
          <>
            <Route index element={<HomePage />} />

            <Route path={"profile/:userId"} element={<ProfilePage />} />

            <Route path={"post/:postId"} element={<SinglePostPage />} />

            <Route
              path="*"
              element={
                <>
                  <h2>This Page Not Found!</h2>
                  <Link to="/" className="btn">
                    Go To Home
                  </Link>
                </>
              }
            />
          </>
        )}
      </Route>
    )
  );
};

export default useAppRouter;
