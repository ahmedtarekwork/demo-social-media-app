import {
  useState,
  useEffect,

  // refs
  useRef,
  forwardRef,
  useImperativeHandle,
  createRef,

  // optimization
  memo,

  // types
  type FormEvent,
  type Dispatch,
  type SetStateAction,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

// components
import { TopMessage, type TopMessageRefType } from "./TopMessage";
import Input, { type InputRefType } from "./Input";

// hooks
import useModalForm, { type TUseModalForm } from "../hooks/useModalForm";

// utils
import { nanoid } from "@reduxjs/toolkit";

// types
import type { TInput } from "../types";

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
  title: string;
  submitFunc: (e: FormEvent) => void;
  makeOnceOpen?: MakeWhenStateChange;
  makeOnceDataChange?: MakeWhenStateChange;
};

const Modal = memo(
  forwardRef<RefType>((_, ref) => {
    // states
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<ModalProps>({
      inputs: [],
      title: "",
      submitBtnContent: "",
      submitFunc: () => {},
    });

    // refs
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

    // useEffects
    useEffect(() => {
      if (showModal) {
        modalData.makeOnceOpen?.(
          modalRef.current,
          formRef.current,
          submitBtnRef.current
        );

        const keyboardFn = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === "escape") toggleModal(false);
        };
        const clickFn = () => toggleModal(false);

        const overlay = overlayRef.current;

        window.addEventListener("keydown", keyboardFn);
        overlay?.addEventListener("click", clickFn);

        return () => {
          window.removeEventListener("keydown", keyboardFn);
          overlay?.removeEventListener("click", clickFn);
        };
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
          <div
            className="app-modal position-fixed start-50 bg-white p-2 rounded w-50"
            ref={modalRef}
          >
            <div className="d-flex align-items-center flex-wrap gap-1 border-bottom border-success mb-3">
              <p className="fw-bold h4 text-success">{modalData.title}</p>
              <button
                className="btn btn-danger ms-auto d-block fw-bold mb-3"
                onClick={() => toggleModal(false)}
              >
                X
              </button>
            </div>

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

              <button
                ref={submitBtnRef}
                className="w-100 btn btn-success shadow-none"
              >
                {modalData.submitBtnContent}
              </button>
            </form>
          </div>

          <div
            className="app-modal-overlay position-fixed bg-black bg-opacity-50"
            ref={overlayRef}
          ></div>

          <TopMessage ref={messageRef} />
        </>,
        document.body
      )
    );
  })
);
export default Modal;
