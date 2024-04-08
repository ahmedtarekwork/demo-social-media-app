export type TUseModalForm = (theForm: HTMLFormElement | null) => {
  requiredInputs: HTMLInputElement[];
  nonRequired: HTMLInputElement[];
  toggleRedInRequired: () => void;
  emptyRequired: HTMLInputElement[];
  nonEmptyNonReq: HTMLInputElement[];
};

const useModalForm: TUseModalForm = (form) => {
  if (form) {
    const requiredInputs = [
      ...form.querySelectorAll(":is(input, textarea)[data-required='true']"),
    ] as HTMLInputElement[];

    const emptyRequired = [...requiredInputs].filter((inp) => {
      if ("value" in inp) if (!inp.value) return inp;
    }) as HTMLInputElement[];

    const nonRequired = [
      ...form.querySelectorAll(
        ":is(input, textarea):not([data-required='true'])"
      ),
    ] as HTMLInputElement[];

    const nonEmptyNonReq = [...nonRequired].filter((inp) =>
      inp.type !== "file" ? inp.value : inp.files!.length
    );

    const toggleRedInRequired = () => {
      requiredInputs.forEach((inp) =>
        inp.classList.toggle("red", !inp.value.trim())
      );
    };

    return {
      requiredInputs,
      nonRequired,
      toggleRedInRequired,
      emptyRequired,
      nonEmptyNonReq,
    };
  }

  throw new Error("form not found!");
};
export default useModalForm;
