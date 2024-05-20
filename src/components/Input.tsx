import {
  useId,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  createRef,
  memo,
  type ChangeEvent,
  type ComponentProps,
  type Ref,
} from "react";

import { TInput } from "../types";

export type InputRefType = {
  input: HTMLInputElement | HTMLTextAreaElement | null;
  name: string;
  val: string;
};

const Input = memo(
  forwardRef(
    (
      {
        label,
        type,
        required,
        name,
        controlled,
        makeOnceStateChanges,
        setDefaultValue,
        ...attr
      }: TInput,
      ref: Ref<InputRefType>
    ) => {
      const id = useId();

      const [value, setValue] = useState(setDefaultValue || "");
      const inputRef = createRef<HTMLInputElement | HTMLTextAreaElement>();

      useImperativeHandle(
        ref,
        () => ({
          input: inputRef.current,
          name,
          val: value,
        }),
        [inputRef, value]
      );

      useEffect(() => {
        makeOnceStateChanges?.(value);
      }, [value]);

      const props = {
        ref: inputRef,
        "data-required": required,
        name,
        id,
        className: `${attr.className} form-control shadow-none mt-1 ${
          type === "textarea" ? "d-block" : ""
        }`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      if (controlled) {
        if (type !== "file") {
          props.value = value;
          props.onChange = (e: ChangeEvent<HTMLInputElement>) => {
            setValue(e.currentTarget.value);
          };
        }
      }

      return (
        <div className="input-holder" key={id}>
          {label && <label htmlFor={id}>{label}</label>}
          {type === "textarea" ? (
            <textarea
              {...(attr as ComponentProps<"textarea">)}
              {...props}
            ></textarea>
          ) : (
            <input
              type={type}
              {...(attr as ComponentProps<"input">)}
              {...props}
            />
          )}
        </div>
      );
    }
  )
);

export default Input;
