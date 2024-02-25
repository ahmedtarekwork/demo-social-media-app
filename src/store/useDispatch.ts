import { useDispatch } from "react-redux";
import { store } from "./store";

export default () => useDispatch<typeof store.dispatch>();
