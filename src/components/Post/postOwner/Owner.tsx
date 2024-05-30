// react
import { useEffect, useRef } from "react";

// react-router
import { Link } from "react-router-dom";

// constants
import { postModalInputs } from "../../../constants";

// components
import Modal, { type RefType } from "../../Modal";
import PostOwnerLeftSide from "./PostOwnerLeftSide";

// react-redux
import useSelector from "../../../hooks/useSelector";
// rtk_query
import {
  // useDeletePostMutation,
  useEditPostMutation,
} from "../../../store/api/api";

// types
import type { GoToProfile, TMessageRef } from "../Post";
import type { TPost, TUser } from "../../../types";

type TypePostOwner = {
  type: "post";
  postData: Pick<TPost, "title" | "body" | "id">;
};
type TypeCommentOwner = {
  type: "comment";
};

export type FinalOwnerData = {
  ownerType: TypePostOwner | TypeCommentOwner;
};

type PostOwnerProps = GoToProfile &
  TMessageRef &
  Pick<TUser, "name" | "username" | "profile_image"> &
  FinalOwnerData & {
    ownerId: TUser["id"];
  };

const Owner = ({
  profile_image,
  name,
  username,
  goToProfilePage,
  messageRef,
  ownerId,
  ownerType,
}: PostOwnerProps) => {
  const modalRef = useRef<RefType>(null);

  const { user } = useSelector((state) => state.user);

  const { type } = ownerType;

  // const [
  //   deletePost,
  //   {
  //     isLoading: deleteLoading,
  //     isError: deleteError,
  //     isSuccess: deleteSuccess,
  //     status: deleteStatus,
  //     error: deleteErrorData,
  //   },
  // ] = useDeletePostMutation();

  const [
    editPost,
    {
      isLoading: editLoading,
      isSuccess: editSuccess,
      isError: editError,
      status: editStatus,
      error: editErrorData,
    },
  ] = useEditPostMutation();

  // const handleDeletePost = () => deletePost(ownerId);

  const submitPostChanges = () => {
    const form = modalRef.current?.form();

    if (form && type === "post") {
      const { title: oldTitle, body: oldBody, id } = ownerType.postData;

      const title = form["title"] as unknown as HTMLInputElement;
      const body = form["body"] as unknown as HTMLInputElement;
      const img = form["image"] as unknown as HTMLInputElement;

      if (title.value === oldTitle && oldBody === body.value) {
        messageRef?.showMessage({
          content: "there is no changes in the post",
          clr: "red",
          time: 3000,
        });
        return;
      }

      const newPostData = new FormData();
      newPostData.append("_method", "put");

      if (title.value !== oldTitle) newPostData.append("title", title.value);

      if (body.value !== oldBody) newPostData.append("body", body.value);
      if (img.files?.length) newPostData.append("image", img.files[0]);

      editPost({ postId: id, postData: newPostData });
    }
  };

  // useEffect(() => {
  //   if (deleteStatus !== "uninitialized") {
  //     if (deleteError) {
  //       const errorObj = (
  //         deleteErrorData as Record<string, Record<string, string>>
  //       ).data;

  //       messageRef?.showMessage({
  //         content: errorObj.error_message || errorObj.message,
  //         clr: "red",
  //         time: 3000,
  //       });
  //     } else if (deleteSuccess) {
  //       messageRef?.showMessage({
  //         content: "post deleted",
  //         clr: "green",
  //         time: 3000,
  //       });
  //     }
  //   }
  // }, [deleteStatus, deleteError, deleteSuccess, deleteErrorData, messageRef]);

  useEffect(() => {
    if (editStatus !== "uninitialized") {
      const makeOnceDataChange = (
        _: unknown,
        __: unknown,
        btn: HTMLButtonElement | null
      ) => btn && (btn.disabled = true);

      if (editLoading) {
        modalRef.current?.setModalData((p) => ({
          ...p,
          submitBtnContent: "Loading...",
          makeOnceDataChange,
        }));
      } else {
        modalRef.current?.setModalData((p) => ({
          ...p,
          submitBtnContent: "Edit Post",
          makeOnceDataChange,
        }));
      }
    }
  }, [editStatus, editLoading]);

  useEffect(() => {
    if (editStatus !== "uninitialized") {
      if (editError) {
        const errorData = (
          editErrorData as Record<string, Record<string, string>>
        )?.data;

        const errorMsg =
          errorData?.message ||
          errorData?.error_message ||
          "something went wrong while editing the post";

        messageRef?.showMessage({
          content: errorMsg,
          clr: "red",
          time: 3500,
        });
      } else if (editSuccess) {
        modalRef.current?.closeModal();

        messageRef?.showMessage({
          content: "post modified successfully",
          clr: "green",
          time: 3000,
        });
      }
    }
  }, [editStatus, editError, editErrorData, editSuccess, messageRef]);

  return (
    <>
      <div className="post-owner d-flex gap-3 align-items-center justify-content-between">
        {goToProfilePage ? (
          <Link
            className="text-black flex-wrap d-flex gap-2 align-items-center"
            relative="path"
            to={`/profile/${ownerId}`}
          >
            <PostOwnerLeftSide
              profile_image={profile_image}
              name={name}
              username={username}
            />
          </Link>
        ) : (
          <div className=" d-flex gap-2 align-items-center">
            <PostOwnerLeftSide
              profile_image={profile_image}
              name={name}
              username={username}
            />
          </div>
        )}

        {type === "comment" || !user || user.id !== ownerId ? null : (
          <div className="d-flex gap-2 align-items-center post-owner-right-side-btns-holder flex-wrap">
            {/* <button onClick={handleDeletePost} className="btn btn-danger">
              {deleteLoading ? "Loading..." : "delete"}
            </button> */}

            <button
              className="btn btn-success"
              onClick={() => {
                const inputs = postModalInputs
                  .slice()
                  .map((o) => ({ ...o }))
                  .map((inp) => {
                    if (
                      ["title", "body"].some((name) => name === inp.name) &&
                      type === "post"
                    ) {
                      const { body: oldBody, title: oldTitle } =
                        ownerType.postData;

                      inp.controlled = true;

                      inp.setDefaultValue =
                        inp.name === "title" ? oldTitle || "" : oldBody;

                      inp.makeOnceStateChanges = () => {
                        const body = modalRef.current?.inputsRef.find(
                          (i) => i.current?.name === "body"
                        )?.current?.val;
                        const title = modalRef.current?.inputsRef.find(
                          (i) => i.current?.name === "title"
                        )?.current?.val;

                        const disable = oldBody === body && oldTitle === title;

                        if (modalRef.current?.submitBtn())
                          modalRef.current.submitBtn()!.disabled = disable;
                      };
                    }

                    return inp;
                  });

                modalRef.current?.setModalData({
                  title: "Edit Post Data",
                  inputs,
                  submitBtnContent: "Edit Post",
                  submitFunc: submitPostChanges,
                });
                modalRef.current?.openModal();
              }}
            >
              edit
            </button>
          </div>
        )}
      </div>

      <Modal ref={modalRef} />
    </>
  );
};

export default Owner;
