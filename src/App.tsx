import { useEffect } from "react";

// react-router
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Link,
} from "react-router-dom";

// react-redux
import useDispatch from "./store/useDispatch";
import { setUser } from "./store/features/userSlice";

// layouts
import MainLayout from "./layouts/MainLayout";

// pages
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/profilePage/ProfilePage";
import SinglePostPage from "./pages/singlePostPage/SinglePostPage";

const homeRoute = "demo-social-media-app";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) dispatch(setUser(JSON.parse(user)));
  }, []);

  const router = createBrowserRouter(
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
            <Route path={homeRoute} element={<HomePage />} />

            <Route path={"profile/:userId"} element={<ProfilePage />} />
            <Route
              path={homeRoute + "profile/:userId"}
              element={<ProfilePage />}
            />

            <Route path={"post/:postId"} element={<SinglePostPage />} />
            <Route
              path={homeRoute + "post/:postId"}
              element={<SinglePostPage />}
            />

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

  return <RouterProvider router={router} />;
}

export default App;
