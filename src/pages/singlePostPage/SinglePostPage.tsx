import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

// react-redux
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

// rtk_query
import { getSinglePostLazy } from "../../store/api/api";

// components
import {
  TopMessage,

  // types
  TopMessageRefType,
} from "../../components/TopMessage";
import Post from "../../components/Post/Post";
import Owner from "../../components/Post/Owner";
import AddCommentForm from "./AddCommentForm";

const SinglePostPage = () => {
  const { postId } = useParams();
  const messageRef = useRef<TopMessageRefType>(null);

  const { user } = useSelector((state: RootState) => state.user);

  const [
    trigger,
    {
      isError: postError,
      error: postErrorData,
      isLoading: postLoading,
      status: postStatus,
      data: postData,
    },
  ] = getSinglePostLazy();

  useEffect(() => {
    if (postId) trigger(postId);
  }, []);

  if (!postId) return <h2>Id not found!</h2>;

  if (postStatus !== "uninitialized" && postLoading) return <h2>Loading...</h2>;

  if (
    postStatus !== "uninitialized" &&
    !postLoading &&
    postError &&
    (postErrorData as unknown as { status: number })!.status === 404
  )
    return (
      <>
        <h2>No post with this Id: {postId}</h2>
        <Link to="/" className="btn">
          Go To Home
        </Link>
      </>
    );

  if (postData?.data) {
    return (
      <>
        <section className="section">
          <Post
            type="single"
            goToProfilePage={true}
            messageRef={messageRef.current}
            {...postData.data}
          />

          {user ? (
            <AddCommentForm messageRef={messageRef.current} postId={postId} />
          ) : (
            <strong
              style={{
                marginTop: 10,
                display: "block",
              }}
            >
              sign in to make comments
            </strong>
          )}

          <ul className="comments-list">
            {postData.data.comments?.map(
              ({
                id: commentId,
                body,
                author: { name, username, profile_image, id },
              }) => {
                return (
                  <li className="comment section" key={commentId}>
                    <Owner
                      messageRef={null}
                      goToProfilePage={true}
                      ownerType={{ type: "comment" }}
                      ownerId={id}
                      name={name}
                      username={username}
                      profile_image={profile_image}
                    />

                    <div className="comment-body">{body}</div>
                  </li>
                );
              }
            )}
          </ul>
        </section>

        <TopMessage ref={messageRef} />
      </>
    );
  }
};
export default SinglePostPage;
