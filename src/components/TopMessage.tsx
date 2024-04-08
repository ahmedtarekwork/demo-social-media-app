import {
  ReactNode,
  forwardRef,
  useRef,
  Ref,
  useImperativeHandle,
  useState,
} from "react";
import { createPortal } from "react-dom";

// types
export type openMsg = {
  content: ReactNode;
  clr: "red" | "green";
  time?: number;
};

export type TopMessageRefType = {
  message: HTMLDivElement | null;
  showMessage: (params: openMsg) => void;
  hideMessage: () => void;
};

type toggleMessageFuncParamType = { open: false } | ({ open: true } & openMsg);

// the component
const TopMessageComponent = (_: unknown, ref: Ref<TopMessageRefType>) => {
  // refs
  const messageRef = useRef<HTMLDivElement>(null);

  // needed for states
  const hideMessageVals: toggleMessageFuncParamType = { open: false };

  // states
  const [messageData, setMessageData] =
    useState<toggleMessageFuncParamType>(hideMessageVals);

  // functions
  const showMessageVals = (params: openMsg) => ({ open: true, ...params });

  // show or hide message
  const toggleMessage = (params: toggleMessageFuncParamType) => {
    if (params.open) {
      const { content, clr, time } = params;

      // put message in the DOM
      setMessageData(
        showMessageVals({
          content: content,
          clr: clr,
          time: time,
        })
      );
      // show message with "active" class
      setTimeout(() => messageRef.current?.classList.add("active"), 5);

      // if there is a specific time to hide the message => setTimeout to hide message after time is end
      if (time) {
        setTimeout(() => toggleMessage(hideMessageVals), time);
      }

      return;
    }

    messageRef.current?.classList.remove("active");
    setTimeout(() => setMessageData(hideMessageVals), 300);
  };

  // imperative handle hook
  useImperativeHandle(
    ref,
    () => ({
      message: messageRef.current,
      showMessage: (params: openMsg) => toggleMessage(showMessageVals(params)),
      hideMessage: () => toggleMessage(hideMessageVals),
    }),
    []
  );

  return (
    messageData.open &&
    createPortal(
      <div
        ref={messageRef}
        className={"top-message " + (messageData.clr || "")}
      >
        {messageData.content}
      </div>,
      document.body
    )
  );
};
export const TopMessage = forwardRef<TopMessageRefType>(TopMessageComponent);
