// react
import { useEffect } from "react";

// components
import { PersonalInfo } from "./personalInfo";
import PostsList from "../../components/Post/PostsList";

// react-router
import { Link, useParams } from "react-router-dom";

// rek_query
import { getUserLazy, getUserPostsLazy } from "../../store/api/api";

const ProfilePage = () => {
  const { userId } = useParams();

  const [
    trigger,
    {
      data: userData,
      isLoading: userLoading,
      isError: userError,
      error: userErrorData,
    },
  ] = getUserLazy();

  const [
    triggerPosts,
    {
      data: posts,
      isLoading: postsLoading,
      isError: postsError,
      error: postsErrorData,
    },
  ] = getUserPostsLazy();

  useEffect(() => {
    if (userId) {
      trigger(userId);
      triggerPosts(userId);
    }
  }, []);

  if (!userId) {
    return (
      <h2>
        no user found!
        <br />
        <Link to="/" className="links">
          Go Home
        </Link>
      </h2>
    );
  }

  if (userLoading) return <h2>Loading...</h2>;
  if (userError && userErrorData) {
    return (
      <h2>
        {(userErrorData as Record<string, Record<string, string>>)?.data
          ?.message || "something went wrong !"}
      </h2>
    );
  }
  if (!userData?.data) return <h2>something went wrong!</h2>;

  const { username } = userData.data;

  return (
    <>
      <PersonalInfo {...userData.data}></PersonalInfo>

      <section className="user-posts">
        {posts?.data.length ? <h2>{username}'s Posts</h2> : null}

        <PostsList
          postsList={posts?.data || []}
          isLoading={postsLoading}
          isError={postsError}
          errorMsg={
            (postsErrorData as Record<string, Record<string, string>>)?.data
              ?.message
          }
          goToProfilePage={false}
        />
      </section>
    </>
  );
};

export default ProfilePage;
