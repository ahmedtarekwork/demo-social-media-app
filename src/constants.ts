import { TInput } from "./interfaces";

export const postModalInputs: TInput[] = [
  {
    label: "title",
    type: "text",
    id: "title-input",
    name: "title",
  },
  {
    type: "textarea",
    label: "body",
    id: "post-body-input",
    name: "body",
    required: true,
  },
  {
    type: "file",
    label: "post image",
    id: "post-img-input",
    name: "image",
  },
];
