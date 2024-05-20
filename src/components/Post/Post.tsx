// components
import { TopMessageRefType } from "../TopMessage";

// interfaces & types
import { TPost } from "../../types";
import { Link } from "react-router-dom";
import Owner, { type FinalOwnerData } from "./postOwner/Owner";

// types \\

export type GoToProfile = { goToProfilePage: boolean };
export type TMessageRef = { messageRef: TopMessageRefType | null };

type PostProps = TPost &
  Partial<GoToProfile> &
  TMessageRef & {
    type?: "single" | "insideList";
  };

const Post = ({
  id: postId,
  image,
  body,
  title,
  created_at,
  author: { name, username, profile_image, id: authorId },
  goToProfilePage = false,
  comments_count,
  messageRef,
  type = "insideList",
}: PostProps) => {
  const ownerProps = (ownerType: FinalOwnerData["ownerType"]) => ({
    name,
    username,
    profile_image,
    ownerId: authorId,
    goToProfilePage,
    messageRef,
    ownerType,
  });

  return (
    <li
      className={`post-card${
        type === "single" ? "" : " card p-3 shadow border-0"
      }`}
    >
      <Owner
        {...ownerProps({
          type: "post",
          postData: {
            title,
            body,
            id: postId,
          },
        })}
      />

      {typeof image === "string" && (
        <div className="d-flex align-items-center justify-content-center">
          <img className="img-fluid" src={image} alt="post-image" />
        </div>
      )}

      <h4>{title}</h4>
      <p>{body}</p>
      <p className="posted-from-time-ago text-muted">{created_at}</p>

      <Link
        to={`/post/${postId}`}
        className="py-3 border-top border-bottom border-secondary w-100 text-black"
      >
        ({comments_count}) comments
      </Link>
    </li>
  );
};

export default Post;
