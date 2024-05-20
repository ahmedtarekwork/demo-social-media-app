import { useDispatch } from "react-redux";
import { store } from "../store/store";

export default useDispatch<typeof store.dispatch>;
