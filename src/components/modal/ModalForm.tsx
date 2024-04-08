// deprecated
/***
 * 
import { FormEvent, forwardRef, Ref } from "react";
import { TInput } from "../../interfaces";
import { nanoid } from "@reduxjs/toolkit";

type TModalFormProps = {
  inputs: TInput[];
  submitBtnContent: string;
  submitFunc: (e: FormEvent) => void;
};

const ModalFormComponent = (
  { submitBtnContent, submitFunc, inputs }: TModalFormProps,
  ref: Ref<HTMLFormElement>
) => {
  return (
    <form
      ref={ref}
      className="app-modal-form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        submitFunc(e);
      }}
    >
      {inputs.map(({ label, id, name, required, ...attr }) => (
        <div className="input-holder" key={nanoid()}>
          <label htmlFor={id}>{label}</label>
          <input
            data-required={required || false}
            id={id}
            name={name || id}
            type="text"
            {...attr}
          />
        </div>
      ))}

      <button className="app-modal-submit-btn btn">{submitBtnContent}</button>
    </form>
  );
};

export const ModalForm = forwardRef(ModalFormComponent);
 */
