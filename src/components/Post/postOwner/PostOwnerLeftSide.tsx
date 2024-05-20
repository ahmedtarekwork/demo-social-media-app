import { FaUserAlt } from "react-icons/fa";
import { TUser } from "../../../types";

const PostOwnerLeftSide = ({
  profile_image,
  name,
  username,
}: Pick<TUser, "name" | "username" | "profile_image">) => {
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
        <p className="post-owner-username fw-bold m-0">#{username}</p>
      </div>
    </>
  );
};

export default PostOwnerLeftSide;
