/* eslint-disable react-refresh/only-export-components */
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
  memo,
} from "react";

type ContextType = {
  title: string;
  body: string;
  setTitle: Dispatch<SetStateAction<string>>;
  setBody: Dispatch<SetStateAction<string>>;
};

export const context = createContext<ContextType>({
  title: "",
  body: "",
  setBody: () => "",
  setTitle: () => "",
});

const ModalContext = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const toPass: ContextType = {
    title,
    body,
    setBody,
    setTitle,
  };

  return <context.Provider value={toPass}>{children}</context.Provider>;
};

export default memo(ModalContext);
