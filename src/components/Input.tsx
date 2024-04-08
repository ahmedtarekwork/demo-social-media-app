import {
  ChangeEvent,
  ComponentProps,
  useId,
  useState,
  useEffect,
  forwardRef,
  Ref,
  useImperativeHandle,
  createRef,
  // SetStateAction,
  // Dispatch,
} from "react";

import { TInput } from "../interfaces";

export type InputRefType = {
  input: HTMLInputElement | HTMLTextAreaElement | null;
  name: string;
  val: string;
};

// forwardRef<InputRefType, TInput>
const Input = forwardRef(
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
            {...props}
            {...(attr as ComponentProps<"textarea">)}
          ></textarea>
        ) : (
          <input
            {...props}
            type={type}
            {...(attr as ComponentProps<"input">)}
          />
        )}
      </div>
    );
  }
);

export default Input;
