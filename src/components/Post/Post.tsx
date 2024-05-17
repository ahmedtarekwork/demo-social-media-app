// components
import { TopMessageRefType } from "../TopMessage";

// interfaces & types
import { TPost } from "../../types";
import { Link } from "react-router-dom";
import Owner, {
  // types
  FinalOwnerData,
} from "./Owner";

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
    <li className={`post-card ${type === "single" ? "" : "section"}`}>
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
        <div className="post-img">
          <img src={image} alt="post-image" />
        </div>
      )}

      <h4 className="post-title">{title}</h4>

      <p className="post-body">{body}</p>

      <p className="posted-from-time-ago">{created_at}</p>

      <Link to={`/post/${postId}`} className="comments-count">
        ({comments_count}) comments
      </Link>
    </li>
  );
};

export default Post;
