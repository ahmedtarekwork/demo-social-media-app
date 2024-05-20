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
    <section className="personal-info bg-white rounded shadow px-1 py-3 row mb-3 align-items-center justify-content-center justify-content-sm-between gap-3 w-100 mx-auto">
      <div className="profile-img d-flex justify-content-center align-items-center col-md-3">
        {typeof profile_image === "string" ? (
          <img className="img-fluid" src={profile_image} alt="profile-img" />
        ) : (
          <FaUserAlt />
        )}
      </div>

      <div className="col-md-4">
        <p className="m-0 mb-2 bg-warning bg-opacity-50 rounded p-1">
          name: {name}{" "}
        </p>
        <p className="m-0 bg-info bg-opacity-50 rounded p-1">
          username : #{username}
        </p>
      </div>

      <div className="col-md-3">
        <p>
          <span className="fs-3">{posts_count}</span> Posts
        </p>
        <p>
          <span className="fs-3">{comments_count}</span> Comments
        </p>
      </div>
    </section>
  );
};
export const PersonalInfo = memo(PersonalInfoComponent);
