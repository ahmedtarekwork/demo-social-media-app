import { TPost } from "../../types";
import Post from "./Post";
import { TopMessage, TopMessageRefType } from "../TopMessage";
import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  SetStateAction,
  Dispatch,
} from "react";

type Props = {
  postsList: TPost[];
  isLoading: boolean;
  isError: boolean;
  isFirstChunck?: boolean;
  errorMsg?: string;
  goToProfilePage?: boolean;
};

export type PostsListRefType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const PostsList = forwardRef<PostsListRefType, Props>(
  (
    { postsList, isLoading, isError, errorMsg, goToProfilePage = true }: Props,
    ref
  ) => {
    const messageRef = useRef<TopMessageRefType>(null);

    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({ loading, setLoading }), [loading]);

    if (isLoading) return <h2>Loading...</h2>;

    if (isError) return <h2>{errorMsg || "something went wrong !"}</h2>;
    if (!postsList.length) return <h2>No Posts To Show</h2>;

    return (
      <>
        <ul className="posts-list">
          {postsList.map((post) => (
            <Post
              messageRef={messageRef.current}
              key={post.id}
              {...post}
              goToProfilePage={goToProfilePage}
            />
          ))}
        </ul>

        {loading ? <h2>Loading...</h2> : null}

        <TopMessage ref={messageRef} />
      </>
    );
  }
);

export default PostsList;
