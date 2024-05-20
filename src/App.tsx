import { useEffect } from "react";

// react-router
import { RouterProvider } from "react-router-dom";

// react-redux
import useDispatch from "./hooks/useDispatch";
import { setUser } from "./store/features/userSlice";

// hooks
import useAppRouter from "./hooks/useAppRouter";

function App() {
  const dispatch = useDispatch();
  const router = useAppRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) dispatch(setUser(JSON.parse(user)));
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
