import {
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  createRef,
  RefObject,
} from "react";

import { createPortal } from "react-dom";

import { nanoid } from "@reduxjs/toolkit";

// components
import { TopMessage, TopMessageRefType } from "./TopMessage";
import Input, {
  // types
  InputRefType,
} from "./Input";

// imported types
import { TInput } from "../types";

// hooks
import useModalForm, { TUseModalForm } from "../hooks/useModalForm";

// types \\

export type RefType = {
  form: () => HTMLFormElement | null;
  submitBtn: () => HTMLButtonElement | null;
  openModal: () => void;
  closeModal: () => void;
  setModalData: Dispatch<SetStateAction<ModalProps>>;
  useModalForm: () => ReturnType<TUseModalForm>;
  inputsRef: RefObject<InputRefType>[];
};

type MakeWhenStateChange = (
  modal: HTMLDivElement | null,
  form: ReturnType<RefType["form"]>,
  btn: ReturnType<RefType["submitBtn"]>
) => void;

export type ModalProps = {
  inputs: TInput[];
  submitBtnContent: string;
  submitFunc: (e: FormEvent) => void;
  makeOnceOpen?: MakeWhenStateChange;
  makeOnceDataChange?: MakeWhenStateChange;
};

const ModalComponent = memo(
  forwardRef<RefType>((_, ref) => {
    const [showModal, setShowModal] = useState(false);

    const [modalData, setModalData] = useState<ModalProps>({
      inputs: [],
      submitBtnContent: "",
      submitFunc: () => {},
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);
    const messageRef = useRef<TopMessageRefType>(null);

    const inputsRef: RefObject<InputRefType>[] = modalData.inputs.map(() =>
      createRef()
    );

    const toggleModal = (open: boolean) => {
      if (open) {
        setShowModal(true);
        setTimeout(() => {
          modalRef.current?.classList.add("active");
          overlayRef.current?.classList.add("active");
        }, 5);
        document.body.style.overflow = "hidden";

        return;
      }

      overlayRef.current?.classList.remove("active");
      modalRef.current?.classList.remove("active");
      setTimeout(() => setShowModal(false), 300);
      document.body.style.removeProperty("overflow");
    };

    useImperativeHandle(
      ref,
      () => ({
        form: () => formRef.current,
        submitBtn: () => submitBtnRef.current,
        useModalForm: () => useModalForm(formRef.current),
        openModal: () => toggleModal(true),
        closeModal: () => toggleModal(false),
        setModalData,
        inputsRef,
      }),
      [inputsRef]
    );

    useEffect(() => {
      if (showModal) {
        modalData.makeOnceOpen?.(
          modalRef.current,
          formRef.current,
          submitBtnRef.current
        );
      }
    }, [showModal]);

    useEffect(() => {
      modalData.makeOnceDataChange?.(
        modalRef.current,
        formRef.current,
        submitBtnRef.current
      );
    }, [modalData]);

    return (
      showModal &&
      createPortal(
        <>
          <div className="app-modal" ref={modalRef}>
            <button
              className="app-modal-close-btn red-btn"
              onClick={() => toggleModal(false)}
            >
              X
            </button>

            <form
              ref={formRef}
              className="app-modal-form"
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();

                const { emptyRequired, toggleRedInRequired } = useModalForm!(
                  e.currentTarget
                );

                toggleRedInRequired();

                if (emptyRequired.length) {
                  messageRef.current?.showMessage({
                    content: "fill in the required inputs",
                    clr: "red",
                    time: 3000,
                  });
                  return;
                }

                modalData.submitFunc(e);
              }}
            >
              {modalData.inputs.map((inputData, i) => {
                return (
                  <Input
                    ref={inputsRef[i]}
                    key={nanoid()}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...(inputData as any)}
                  />
                );
              })}

              <button ref={submitBtnRef} className="app-modal-submit-btn btn">
                {modalData.submitBtnContent}
              </button>
            </form>
          </div>
          <div className="app-modal-overlay" ref={overlayRef}></div>

          <TopMessage ref={messageRef} />
        </>,
        document.body
      )
    );
  })
);
export const Modal = ModalComponent;
