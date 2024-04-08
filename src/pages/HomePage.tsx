import { getPostsLazy } from "../store/api/api";

import PostsList, { PostsListRefType } from "../components/Post/PostsList";
import { useEffect, useRef, useState } from "react";
import { TPost } from "../interfaces";

const HomePage = () => {
  const postsListRef = useRef<PostsListRefType>(null);

  const [getPosts, { isLoading, isError, data }] = getPostsLazy();

  const prevNum = useRef(0);
  const prevPosts = useRef<TPost[]>([]);

  const [page, setPage] = useState(1);

  const [allPosts, setAllPosts] = useState<TPost[]>([]);

  useEffect(() => {
    if (prevNum.current < page) {
      getPosts(page)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((_) => {
          postsListRef.current?.loading
            ? postsListRef.current?.setLoading(false)
            : null;
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((_) => {
          postsListRef.current?.loading
            ? postsListRef.current?.setLoading(false)
            : null;
        });
      prevNum.current += 1;
    }
  }, [page, getPosts]);

  const sameObjects = <T,>(obj1: T, obj2: T): boolean => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  useEffect(() => {
    if (data && !isError && !isLoading) {
      if (!sameObjects(prevPosts.current, data.data)) {
        prevPosts.current = data.data;

        setAllPosts((p) => [...p, ...data.data]);
      }
    }
  }, [page, data, isError, isLoading]);

  window.onscroll = () => {
    const lastPage = data?.meta.last_page;

    const totalHeight = document.documentElement.scrollHeight;
    const scrolled = scrollY + innerHeight;

    if (scrolled >= totalHeight) {
      if (page !== lastPage && !postsListRef.current?.loading) {
        setPage((p) => p + 1);
        postsListRef.current?.setLoading(true);
      }
    }
  };

  if (isError) return <h2>something went wrong!</h2>;

  return (
    <div>
      <ul className="posts-list">
        <PostsList
          ref={postsListRef}
          isLoading={isLoading}
          isError={isError}
          postsList={allPosts}
        />
      </ul>
    </div>
  );
};
export default HomePage;
