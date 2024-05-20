import { useSelector, type TypedUseSelectorHook } from "react-redux";
import { type RootState } from "../store/store";

const selector: TypedUseSelectorHook<RootState> = useSelector;

export default selector;
