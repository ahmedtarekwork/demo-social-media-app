import { ComponentProps } from "react";

type ForBoth = {
  label?: string;
  id: string;
  name: string;
  required?: boolean;
  controlled?: boolean;
  makeOnceStateChanges?: (state: string) => void;
  setDefaultValue?: string;
};

export type TInput = ForBoth &
  (
    | ({
        type: "textarea";
      } & ComponentProps<"textarea">)
    | ({
        type: ComponentProps<"input">["type"];
      } & ComponentProps<"input">)
  );

type image = string | object;

export type TUser = {
  username: string;
  name: string;
  id: number;
  profile_image: image;
  comments_count: number;
  posts_count: number;
};

export type TComment = {
  id: number;
  body: string;
  author: TUser;
};

export type TPost = {
  title: string | null;
  image: image;
  comments_count: number;
  created_at: string;
  body: string;
  id: number;
  tags: Record<string, unknown>[];
  author: Pick<TUser, "username" | "name" | "id" | "profile_image"> &
    Record<string, unknown>;

  comments?: TComment[];
};
