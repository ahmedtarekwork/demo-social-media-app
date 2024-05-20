import { FormEvent, useEffect, useRef } from "react";
import { useMakeCommentMutation } from "../../store/api/api";
import { TopMessageRefType } from "../../components/TopMessage";

type Props = {
  messageRef: TopMessageRefType | null;
  postId: string;
};

const AddCommentForm = ({ postId, messageRef }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [
    makeComment,
    {
      isError: commentError,
      error: commentErrorData,
      isLoading: commentLoading,
      isSuccess: commentSuccess,
      status: commentStatus,
    },
  ] = useMakeCommentMutation();

  const handleAddingComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current) throw new Error("no submit btn !");

    const val = inputRef.current?.value;

    if (val.trim()) {
      makeComment({
        postId,
        body: val,
      });
    }
  };

  useEffect(() => {
    if (btnRef.current && commentStatus !== "uninitialized") {
      btnRef.current.textContent = commentLoading ? "Loading..." : "add";
    }
  }, [commentStatus, commentLoading]);

  useEffect(() => {
    if (commentStatus !== "uninitialized") {
      if (commentError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = commentErrorData as any;

        let content =
          error?.data?.message || "something went wrong when make a comment";

        if (error?.status === 404) content = "post not found !";

        messageRef?.showMessage({
          clr: "red",
          content,
          time: 3000,
        });
      } else if (commentSuccess) {
        if (inputRef.current) inputRef.current.value = "";
      }
    }
  }, [
    commentStatus,
    commentError,
    commentErrorData,
    commentSuccess,
    messageRef,
  ]);

  return (
    <form
      className="add-comment-form mt-3 d-flex"
      onSubmit={handleAddingComment}
    >
      <input
        className="form-control shadow-none"
        ref={inputRef}
        type="text"
        name="body"
        placeholder="add comment..."
        disabled={commentStatus !== "uninitialized" ? commentLoading : false}
      />

      <button
        ref={btnRef}
        className="btn btn-success border-0"
        disabled={commentStatus !== "uninitialized" ? commentLoading : false}
      >
        add
      </button>
    </form>
  );
};
export default AddCommentForm;
