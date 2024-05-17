// react-router
import { Link } from "react-router-dom";

// constants
import { postModalInputs } from "../../constants";

import {
  Modal,

  // types
  RefType,
} from "../Modal";
import { useEffect, useRef } from "react";

// icons
import { FaUserAlt } from "react-icons/fa";

// react-redux
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
// rtk_query
import {
  useDeletePostMutation,
  useEditPostMutation,
} from "../../store/api/api";

// types
import {
  // types
  GoToProfile,
  TMessageRef,
} from "./Post";
import { TPost, TUser } from "../../types";

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

  const { user } = useSelector((state: RootState) => state.user);

  const { type } = ownerType;

  const LeftSide = () => {
    return (
      <>
        <div className="post-owner-img">
          {typeof profile_image === "string" ? (
            <img src={profile_image as string} alt="post-owner-image" />
          ) : (
            <FaUserAlt />
          )}
        </div>

        <div className="post-owner-names">
          <strong className="post-owner-name">{name}</strong>
          <p className="post-owner-username">#{username}</p>
        </div>
      </>
    );
  };

  const [
    deletePost,
    {
      isLoading: deleteLoading,
      isError: deleteError,
      isSuccess: deleteSuccess,
      status: deleteStatus,
      error: deleteErrorData,
    },
  ] = useDeletePostMutation();

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

  const handleDeletePost = () => deletePost(ownerId);

  const handleEditPost = () => {
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

  useEffect(() => {
    if (deleteStatus !== "uninitialized") {
      if (deleteError) {
        const errorObj = (
          deleteErrorData as Record<string, Record<string, string>>
        ).data;

        messageRef?.showMessage({
          content: errorObj.error_message || errorObj.message,
          clr: "red",
          time: 3000,
        });
      } else if (deleteSuccess) {
        messageRef?.showMessage({
          content: "post deleted",
          clr: "green",
          time: 3000,
        });
      }
    }
  }, [deleteStatus, deleteError, deleteSuccess, deleteErrorData, messageRef]);

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
      <div className="post-owner">
        {goToProfilePage ? (
          <Link
            className="left-side"
            relative="path"
            to={`/profile/${ownerId}`}
          >
            <LeftSide />
          </Link>
        ) : (
          <div className="left-side">
            <LeftSide />
          </div>
        )}

        {type === "comment" || !user || user.id !== ownerId ? null : (
          <div className="right-side">
            <button onClick={handleDeletePost} className="red-btn">
              {deleteLoading ? "Loading..." : "delete"}
            </button>

            <button
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
                  inputs,
                  submitBtnContent: "Edit Post",
                  submitFunc: handleEditPost,
                });
                modalRef.current?.openModal();
              }}
              className="btn"
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
