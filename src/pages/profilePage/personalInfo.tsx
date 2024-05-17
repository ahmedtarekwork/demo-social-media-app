import { FaUserAlt } from "react-icons/fa";
import { memo } from "react";
import { TUser } from "../../types";

const PersonalInfoComponent = ({
  profile_image,
  name,
  username,
  posts_count,
  comments_count,
}: TUser) => {
  return (
    <section className="personal-info section">
      <div className="profile-img">
        {typeof profile_image === "string" ? (
          <img src={profile_image} alt="profile-img" />
        ) : (
          <FaUserAlt />
        )}
      </div>

      <div className="profile-info">
        <p>name: {name} </p>
        <p>username : #{username}</p>
      </div>

      <div className="posts-data">
        <p className="posts-count">
          <span className="num-of-posts">{posts_count}</span> Posts
        </p>
        <p className="final-comments-count">
          <span className="num-of-comments">{comments_count}</span> Comments
        </p>
      </div>
    </section>
  );
};
export const PersonalInfo = memo(PersonalInfoComponent);
